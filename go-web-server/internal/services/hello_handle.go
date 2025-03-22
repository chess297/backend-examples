package services

import "github.com/gin-gonic/gin"

type HelloRes struct {
	Message string `json:"message"`
}

func (c *CmsApp) Hello(ctx *gin.Context) {

	ctx.JSON(200, gin.H{
		"data": HelloRes{
			Message: "Hello world!",
		},
	})
}
