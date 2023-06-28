/** 图片格式 */
export interface ImgInComicTool {
  name: string; // 图片名称
  base64: string; // 图片 base64
  size: number; // 图片大小
  width: number; // 图片宽度
  height: number; // 图片高度
  children?: ImgInComicTool[]; // 切图子集
  sha1?: string; // 图片 sha1（可以此字段判断图片是否被上传过）
}

/** 输出图片格式 */
export interface ImgInOutput {
  name: string; // 图片名称
  width: number; // 图片宽度
  height: number; // 图片高度
}
