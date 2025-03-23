package services

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type HelloRes struct {
	Message string `json:"message"`
}

func (c *CmsApp) Hello(ctx *gin.Context) {
	name := ctx.Query("name")
	msg := fmt.Sprintf("Hello %s", name)

	ctx.JSON(200, gin.H{
		"data": HelloRes{
			Message: msg,
		},
	})
}
