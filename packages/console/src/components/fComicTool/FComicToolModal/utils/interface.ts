/** 图片 */
export interface ImgInComicTool {
  name: string; // 图片名称
  base64: string; // 图片 base64
  size: number; // 图片大小
  children?: ImgInComicTool[]; // 切图子集
  sha1?: string; // 图片 sha1（可以此字段判断图片是否被上传过）
}
