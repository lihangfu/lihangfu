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

	// 服务静态文件
	router.StaticFS("/", http.FS(distFS))
}
