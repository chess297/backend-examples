package services

import "github.com/gin-gonic/gin"

func (s *CmsApp) GetUserInfo(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "hello world",
	})
}
