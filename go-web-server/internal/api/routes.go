package api

import (
	"go-web-server/internal/services"

	"github.com/gin-gonic/gin"
)

const (
	RootPath = "/api/v1"
)

func RegisterRoutes(r gin.IRouter) {
	cmsApp := services.New()
	noAuthGroup := r.Group(RootPath)
	{
		noAuthGroup.GET("/hello", cmsApp.Hello)
		noAuthGroup.POST("/register", cmsApp.Register)
		noAuthGroup.POST("/login", cmsApp.Login)
		noAuthGroup.POST("/user/info", cmsApp.GetUserInfo)
	}
	// noAuthGroup:= r.Group(RootPath)
}
