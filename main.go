package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

//go:embed all:frontend/dist/*
var buildFS embed.FS

func main() {
	// Initialize HTTP server
	server := gin.New()
	server.Use(gin.Recovery())

	SetWebRouter(server, buildFS)

	var port = os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(16213)
	}
	fmt.Printf("server started on http://localhost:%s\n", port)
	err := server.Run(":" + port)
	if err != nil {
		fmt.Print("failed to start HTTP server: " + err.Error())
	}
}

func SetWebRouter(router *gin.Engine, buildFS embed.FS) {
	indexPageData, _ := buildFS.ReadFile("frontend/dist/index.html")
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(static.Serve("/", EmbedFolder(buildFS, "frontend/dist")))
	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") {
			RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPageData)
	})
}

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	efs, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(efs),
	}
}

func RelayNotFound(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"error": fmt.Errorf("invalid_request_error"),
	})
}
