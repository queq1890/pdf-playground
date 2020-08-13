// TODO:
// - typings
// - better interface

import PDFJS, { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/webpack";

interface Option {
  scale?: number;
  width: number;
  height: number;
  image?: "jpeg" | "webp" | "png";
}

class Pdf2Image {
  pdfDoc: PDFDocumentProxy;

  constructor(pdfDoc: PDFDocumentProxy) {
    this.pdfDoc = pdfDoc;
  }

  static async open(pdfUrl: string) {
    const pdfDoc = await PDFJS.getDocument({ url: pdfUrl }).promise;
    return new Pdf2Image(pdfDoc);
  }

  numPages() {
    return this.pdfDoc.numPages;
  }

  /**
   * PDFの指定ページを画像にし、画像のDataUrlを返す
   */
  async getImageDataUrl(pageNo: number, option: Option) {
    const page = await this.pdfDoc.getPage(pageNo);
    const scale = Pdf2Image.calcScale(page, option);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (canvasContext) {
      const renderContext = {
        canvasContext,
        viewport,
      };

      await page.render(renderContext).promise;
      switch (option.image) {
        case "jpeg":
          return canvas.toDataURL("image/jpeg");
        case "webp":
          return canvas.toDataURL("image/webp");
        default:
          return canvas.toDataURL();
      }
    }

    this.cleanUp(canvas);
  }

  static calcScale(page: PDFPageProxy, option: Option) {
    if (option.scale !== undefined) {
      return option.scale;
    }
    if (option.width === undefined || option.height === undefined) {
      return 1.0;
    }
    const viewport = page.getViewport({ scale: 1.0 });
    return Math.min(
      option.width / viewport.width,
      option.height / viewport.height
    );
  }

  /**
   * PDFのすべてのページを画像にし、画像のDataUrlを返す
   */
  async getAllImageDataUrl(option: Option) {
    const pages = [];
    const numPages = this.numPages();
    for (let i = 1; i <= numPages; i += 1) {
      const img = await this.getImageDataUrl(i, option);
      pages.push(img);
    }
    return pages;
  }

  cleanUp(canvas: HTMLCanvasElement) {
    canvas.height = 0;
    canvas.width = 0;
  }
}

export default Pdf2Image;
