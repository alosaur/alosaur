// import { Buffer, readerFromStreamReader } from "../deps.ts";
import { RequestBodyFormDataParseOptions } from "../models/request.ts";

/**
 * Gets parsed form data with options
 * @param request
 * @param contentType
 * @param option
 */
export function getParsedFormData(
  request: Request,
  contentType: string,
  option?: RequestBodyFormDataParseOptions,
) {
  if (option && option.parser) {
    return option.parser(request, contentType);
  }

  //  Gets by default max memory 10 mb
  return getFormData(
    request,
    contentType,
    option && option.maxMemory || 10,
  );
}

/**
 * Gets form data from contentType multipart/form-data
 * @param request
 * @param contentType
 * @param maxMemory in MB
 */
export async function getFormData(
  request: Request,
  contentType: string,
  maxMemory: number,
) {
  const match = contentType.match(/boundary=([^\s]+)/);

  if (match) {
    return await request.formData();
  }

  return;
}

function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}
