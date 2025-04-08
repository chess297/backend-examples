package model

const (
	CodeOk  = 0
	CodeErr = 1
	MsgOk   = "success"
	MsgErr  = "error"
)

type BaseRes struct {
	Code int         `json:"code" binding:"required"`
	Msg  string      `json:"msg" binding:"required"`
	Data interface{} `json:"data" binding:"omitempty"`
}
