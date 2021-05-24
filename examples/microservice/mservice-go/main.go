package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"strconv"
	"strings"
)

const separator = "#";
const endOfMessage = '\n';

func server() {
	ln, err := net.Listen("tcp", ":4500")
	if err != nil {
		fmt.Println(err)
		return
	}
	for {
		c, err := ln.Accept()
		if err != nil {
			fmt.Println(err)
			continue
		}

		println("new connect")

		go handleServerConnection(c)
	}
}

type JsonType struct {
	Array []int
}

func handleServerConnection(c net.Conn) {
	for {
		message, _ := bufio.NewReader(c).ReadString(endOfMessage)

		req := strings.Split(message, separator);
		pattern := req[0];
		data := req[1];

		arr := JsonType{}
		err := json.Unmarshal([]byte(data), &arr.Array)

		if err != nil {
			fmt.Println(err)
			return
		}

		response := strconv.Itoa(sum(arr))

		c.Write([]byte(pattern + separator + response  + "\n"))
	}
}

func sum(json JsonType) int {
	result := 0
	for _, v := range json.Array {
		result += v
	}
	return result
}

func main() {
	server();
}
