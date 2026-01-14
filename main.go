package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize HTTP server
	server := gin.New()
	server.Use(gin.Recovery())

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
