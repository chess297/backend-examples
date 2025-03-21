package services

import "github.com/gin-gonic/gin"

type HelloRes struct {
	
}


func(c *CmsApp) Hello(ctx *gin.Context) {
	
	ctx.JSON(200, gin.H{
		"message": "Hello world!",
		"data": HelloRes{},
	})
}