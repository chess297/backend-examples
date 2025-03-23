package services

import (
	"fmt"
	"go-web-server/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

type HelloRes struct {
	Message string `json:"message"`
}

func (c *CmsApp) Hello(ctx *gin.Context) {
	name := ctx.Query("name")
	msg := fmt.Sprintf("Hello %s", name)
	var res model.BaseRes
	var code int
	if name == "" {
		res = model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: HelloRes{
				Message: "name is empty",
			},
		}
		code = http.StatusBadRequest
	} else {
		res = model.BaseRes{
			Code: model.CodeOk,
			Msg:  model.MsgOk,
			Data: HelloRes{
				Message: msg,
			},
		}
		code = http.StatusOK
	}
	ctx.JSON(code, res)
}
