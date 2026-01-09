.PHONY: build clean frontend

BIN=lihangfu
DIR_SRC=./

GO_ENV=CGO_ENABLED=0 GO111MODULE=on
Revision=$(shell git rev-parse --short HEAD 2>/dev/null || echo "")
GO_FLAGS=-ldflags="-extldflags -static"
GO=$(GO_ENV) "$(shell which go)"

build: generate
	@$(GO) build $(GO_FLAGS) -o $(BIN) $(DIR_SRC)

# https://dev.to/thewraven/universal-macos-binaries-with-go-1-16-3mm3
universal: generate
	@GOOS=darwin GOARCH=amd64 $(GO_ENV) $(GO) build $(GO_FLAGS) -o ${BIN}_amd64 $(DIR_SRC)
	@GOOS=darwin GOARCH=arm64 $(GO_ENV) $(GO) build $(GO_FLAGS) -o ${BIN}_arm64 $(DIR_SRC)
	@lipo -create -output ${BIN} ${BIN}_amd64 ${BIN}_arm64
	@rm -f ${BIN}_amd64 ${BIN}_arm64

generate:
	@$(GO) mod tidy

# clean all build result
clean:
	@$(GO) clean ./...
	@rm -f $(BIN)

frontend:
	@cd frontend && pnpm build && cd -

all: clean build