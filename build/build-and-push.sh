#!/bin/bash
# 构建并推送前后端镜像到 GitHub Container Registry

set -e

# 镜像配置
REGISTRY="ghcr.io"
NAMESPACE="lihangfu"
FRONTEND_IMAGE="${REGISTRY}/${NAMESPACE}/frontend"
BACKEND_IMAGE="${REGISTRY}/${NAMESPACE}/backend"

# 获取 git commit hash 作为镜像标签
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
TIMESTAMP=$(date +%Y%m%d%H%M%S)
TAG="${COMMIT_HASH}-${TIMESTAMP}"
LATEST_TAG="latest"

echo "======================================"
echo "开始构建镜像"
echo "======================================"
echo "标签: ${TAG}"
echo ""

# 构建 Backend 镜像
echo ">>> 构建 Backend 镜像..."
docker buildx build \
  --platform linux/amd64 \
  -f build/Dockerfile.backend \
  -t "${BACKEND_IMAGE}:${TAG}" \
  -t "${BACKEND_IMAGE}:${LATEST_TAG}" \
  --load \
  .

echo ">>> Backend 镜像构建完成: ${BACKEND_IMAGE}:${TAG}"
echo ""

# 构建 Frontend 镜像
echo ">>> 构建 Frontend 镜像..."
docker buildx build \
  --platform linux/amd64 \
  -f build/Dockerfile.frontend \
  -t "${FRONTEND_IMAGE}:${TAG}" \
  -t "${FRONTEND_IMAGE}:${LATEST_TAG}" \
  --load \
  ./frontend

echo ">>> Frontend 镜像构建完成: ${FRONTEND_IMAGE}:${TAG}"
echo ""

echo "======================================"
echo "开始推送镜像"
echo "======================================"
echo ""

# 推送 Backend 镜像
echo ">>> 推送 Backend 镜像..."
docker push "${BACKEND_IMAGE}:${TAG}"
docker push "${BACKEND_IMAGE}:${LATEST_TAG}"

echo ">>> Backend 镜像推送完成"
echo ""

# 推送 Frontend 镜像
echo ">>> 推送 Frontend 镜像..."
docker push "${FRONTEND_IMAGE}:${TAG}"
docker push "${FRONTEND_IMAGE}:${LATEST_TAG}"

echo ">>> Frontend 镜像推送完成"
echo ""

echo "======================================"
echo "构建和推送完成！"
echo "======================================"
echo "Backend:  ${BACKEND_IMAGE}:${TAG}"
echo "Frontend: ${FRONTEND_IMAGE}:${TAG}"
echo ""
