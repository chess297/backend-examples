package main

import (
	"fmt"
	"go-web-server/internal/api"

	"github.com/gin-gonic/gin"
)

func main() {
	r:= gin.Default()
	api.RegisterRoutes(r)
	err:=r.Run()
	if err != nil {
		fmt.Printf("r run error = %v", err)
		return
	}
}