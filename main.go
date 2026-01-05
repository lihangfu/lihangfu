package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

//go:embed all:frontend/dist
var buildFS embed.FS

func main() {
	// Initialize HTTP server
	server := gin.New()
	server.Use(gin.Recovery())

	SetRouter(server, buildFS)
	var port = os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(16213)
	}
	fmt.Printf("server started on http://localhost:%s", port)
	err := server.Run(":" + port)
	if err != nil {
		fmt.Print("failed to start HTTP server: " + err.Error())
	}
}

func SetRouter(router *gin.Engine, buildFS embed.FS) {
	// 提取 ui/dist 子目录，使路径从根目录开始
	distFS, err := fs.Sub(buildFS, "frontend/dist")
	if err != nil {
		panic("failed to load embedded dist files: " + err.Error())
	}

	// SPA fallback：智能路由处理
	router.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path

		// 尝试读取请求的文件
		if path != "/" {
			// 移除开头的 /
			filePath := path[1:]
			if fileData, err := fs.ReadFile(distFS, filePath); err == nil {
				// 文件存在，根据扩展名设置 Content-Type 并返回
				contentType := getContentType(filePath)
				c.Data(http.StatusOK, contentType, fileData)
				return
			}
		}

		// 文件不存在或路径为 /，返回 index.html（SPA fallback）
		indexHTML, err := fs.ReadFile(distFS, "index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to load index.html")
			return
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHTML)
	})
}

// 根据文件扩展名返回 Content-Type
func getContentType(filePath string) string {
	switch {
	case len(filePath) >= 3 && filePath[len(filePath)-3:] == ".js":
		return "application/javascript; charset=utf-8"
	case len(filePath) >= 4 && filePath[len(filePath)-4:] == ".css":
		return "text/css; charset=utf-8"
	case len(filePath) >= 5 && filePath[len(filePath)-5:] == ".json":
		return "application/json; charset=utf-8"
	case len(filePath) >= 4 && filePath[len(filePath)-4:] == ".png":
		return "image/png"
	case len(filePath) >= 4 && filePath[len(filePath)-4:] == ".jpg", len(filePath) >= 5 && filePath[len(filePath)-5:] == ".jpeg":
		return "image/jpeg"
	case len(filePath) >= 4 && filePath[len(filePath)-4:] == ".svg":
		return "image/svg+xml"
	case len(filePath) >= 4 && filePath[len(filePath)-4:] == ".ico":
		return "image/x-icon"
	case len(filePath) >= 5 && filePath[len(filePath)-5:] == ".woff":
		return "font/woff"
	case len(filePath) >= 6 && filePath[len(filePath)-6:] == ".woff2":
		return "font/woff2"
	default:
		return "application/octet-stream"
	}
}
