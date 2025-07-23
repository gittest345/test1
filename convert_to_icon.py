# 导入必要的库
from PIL import Image
import os

def convert_to_ico(input_path, output_path=None, sizes=None):
    """
    将PNG图像转换为ICO格式（适合网页图标）
    
    参数:
        input_path: 输入图像的路径
        output_path: 输出ICO文件的路径，如果为None，则使用输入文件名但扩展名改为.ico
        sizes: 要包含在ICO文件中的图标尺寸列表，默认为[16, 32, 48, 64, 128]
    
    返回:
        输出文件的路径
    """
    if sizes is None:
        sizes = [16, 32, 48, 64, 128]  # 常用的图标尺寸
    
    # 如果没有指定输出路径，则使用输入文件名但扩展名改为.ico
    if output_path is None:
        filename = os.path.splitext(input_path)[0]
        output_path = f"{filename}.ico"
    
    # 打开原始图像
    img = Image.open(input_path)
    
    # 创建不同尺寸的图像
    icon_sizes = [(size, size) for size in sizes]
    resized_images = [img.resize(size, Image.LANCZOS) for size in icon_sizes]
    
    # 保存为ICO文件
    resized_images[0].save(
        output_path, 
        format='ICO', 
        sizes=[(img.width, img.height) for img in resized_images],
        append_images=resized_images[1:]
    )
    
    return output_path

def convert_to_favicon(input_path, output_path=None):
    """
    将PNG图像转换为favicon.ico（16x16和32x32尺寸）
    
    参数:
        input_path: 输入图像的路径
        output_path: 输出favicon.ico文件的路径，如果为None，则使用'favicon.ico'
    
    返回:
        输出文件的路径
    """
    if output_path is None:
        output_path = "favicon.ico"
    
    return convert_to_ico(input_path, output_path, sizes=[16, 32])

def convert_to_svg(input_path, output_path=None):
    """
    注意：此函数仅提供信息，PIL不能直接将位图转换为SVG矢量格式。
    要获得高质量的SVG，建议使用专业的矢量图形软件如Adobe Illustrator或Inkscape。
    
    参数:
        input_path: 输入图像的路径
        output_path: 输出SVG文件的路径
    """
    print("注意：PNG到SVG的转换需要矢量化处理，这超出了简单脚本的能力。")
    print("建议使用专业的矢量图形软件如Adobe Illustrator或Inkscape来创建SVG图标。")
    return None

# 主函数
def main():
    # 获取当前目录下的PNG文件
    png_file = "图标王者.png"
    png_path = os.path.join(os.path.dirname(__file__), png_file)
    
    if not os.path.exists(png_path):
        print(f"错误：找不到文件 {png_path}")
        return
    
    # 转换为标准ICO（包含多种尺寸）
    ico_path = convert_to_ico(png_path)
    print(f"已创建标准图标: {ico_path}")
    
    # 转换为favicon.ico（网站图标，包含16x16和32x32尺寸）
    favicon_path = convert_to_favicon(png_path, "favicon.ico")
    print(f"已创建网站图标: {favicon_path}")
    
    print("\n注意：如果需要SVG格式，建议使用专业的矢量图形软件。")
    print("SVG格式是矢量格式，对于网页图标来说有更好的缩放性能。")

if __name__ == "__main__":
    main()