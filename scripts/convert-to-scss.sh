#!/bin/bash

# 批量将TableLowcode组件的样式改为SCSS格式

echo "开始将TableLowcode组件样式转换为SCSS格式..."

TARGET_DIR="src/components/TableLowcode"

# 需要转换的文件列表
files_to_convert=(
  "filters/FilterDateRange.vue"
  "filters/FilterDate.vue" 
  "filters/FilterInput.vue"
  "filters/FilterCheckbox.vue"
  "filters/FilterSwitch.vue"
  "filters/FilterSelect.vue"
  "filters/FilterRadio.vue"
  "Config/forms/SortSettingsForm.vue"
  "Config/forms/FilterListSettingsForm.vue"
  "Config/ConfigPanel.vue"
  "components/ViewManager/index.vue"
  "components/ViewManager/ViewTabs.vue"
  "components/ViewManager/ViewActions.vue"
  "components/FilterSection.vue"
  "components/PaginationBar.vue"
  "components/ActionBar.vue"
  "components/TableSection.vue"
  "Table/FloatingActionBar.vue"
  "Table/DataTable.vue"
)

# 转换函数
convert_to_scss() {
  local file="$1"
  local full_path="$TARGET_DIR/$file"
  
  if [ -f "$full_path" ]; then
    echo "转换: $file"
    
    # 替换 <style scoped> 为 <style lang="scss" scoped>
    sed -i.bak 's/<style scoped>/<style lang="scss" scoped>/g' "$full_path"
    
    # 在样式开头添加工具样式导入
    # 计算相对路径深度
    depth=$(echo "$file" | tr -cd '/' | wc -c)
    import_path=""
    for ((i=0; i<depth; i++)); do
      import_path="../$import_path"
    done
    import_path="${import_path}styles/utilities.scss"
    
    # 在第一个CSS规则前添加导入
    awk -v import_line="@import '$import_path';" '
    /<style lang="scss" scoped>/ { 
      print; 
      getline; 
      print import_line; 
      print ""; 
      print; 
      next 
    } 
    { print }
    ' "$full_path" > "$full_path.tmp" && mv "$full_path.tmp" "$full_path"
    
    # 清理备份文件
    rm -f "$full_path.bak"
    
  else
    echo "文件不存在: $full_path"
  fi
}

# 批量转换
for file in "${files_to_convert[@]}"; do
  convert_to_scss "$file"
done

echo "转换完成！"
echo ""
echo "请手动检查以下内容："
echo "1. 导入路径是否正确"
echo "2. 样式是否需要使用SCSS变量替换硬编码值"
echo "3. 是否可以使用工具类简化样式"
