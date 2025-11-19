#!/bin/bash

# TableLowcode 行内样式批量优化脚本
# 将常见的行内样式替换为CSS类

echo "开始优化 TableLowcode 组件的行内样式..."

# 定义目标目录
TARGET_DIR="src/components/TableLowcode"

# 检查目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "错误: 目录 $TARGET_DIR 不存在"
    exit 1
fi

# 备份原文件
echo "创建备份..."
cp -r "$TARGET_DIR" "${TARGET_DIR}_backup_$(date +%Y%m%d_%H%M%S)"

# 替换常见的宽度样式
echo "优化宽度样式..."
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 80px;"/class="w-80"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 100px;"/class="w-100"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 120px;"/class="w-120"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 140px;"/class="w-140"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 200px;"/class="w-200"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="width: 400px;"/class="w-400"/g' {} \;

# 替换最小宽度样式
echo "优化最小宽度样式..."
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="min-width: 120px;"/class="min-w-120"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="min-width: 140px;"/class="min-w-140"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="min-width: 200px;"/class="min-w-200"/g' {} \;

# 替换间距样式
echo "优化间距样式..."
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="margin-bottom: 12px;"/class="mb-12"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="margin-top: 12px;"/class="mt-12"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="margin-bottom: 8px;"/class="mb-8"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="margin-top: 8px;"/class="mt-8"/g' {} \;

# 替换字体大小样式
echo "优化字体大小样式..."
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="font-size: 12px;"/class="text-sm"/g' {} \;
find "$TARGET_DIR" -name "*.vue" -type f -exec sed -i.bak 's/style="font-size: 11px;"/class="text-xs"/g' {} \;

# 清理备份文件
echo "清理临时文件..."
find "$TARGET_DIR" -name "*.bak" -type f -delete

# 统计优化结果
echo "优化完成！"
echo "统计剩余的行内样式:"
remaining_styles=$(find "$TARGET_DIR" -name "*.vue" -type f -exec grep -l 'style="' {} \; | wc -l)
echo "还有 $remaining_styles 个文件包含行内样式"

# 显示需要手动处理的复杂样式
echo ""
echo "需要手动处理的复杂行内样式:"
find "$TARGET_DIR" -name "*.vue" -type f -exec grep -n 'style="[^"]*"' {} \; | head -10

echo ""
echo "优化建议:"
echo "1. 在组件中导入工具样式: @import '../styles/utilities.scss';"
echo "2. 检查并测试样式效果是否正确"
echo "3. 手动处理剩余的复杂行内样式"
