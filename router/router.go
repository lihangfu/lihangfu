package router

import (
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Serve() {
	server := gin.New()
	server.Use(gin.Recovery())

	var port = os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(16213)
	}
	log.Printf("[API] server started on http://localhost:%s\n", port)
	err := server.Run(":" + port)
	if err != nil {
		log.Printf("[API] failed to start HTTP server: %s", err.Error())
	}
}
