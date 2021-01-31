import { MultipartReader, ServerRequest } from "../deps.ts";
import { RequestBodyFormDataParseOptions } from "../models/request.ts";

/**
 * Gets parsed form data with options
 * @param request
 * @param contentType
 * @param option
 */
export function getParsedFormData(
  request: ServerRequest,
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
  request: ServerRequest,
  contentType: string,
  maxMemory: number,
) {
  const match = contentType.match(/boundary=([^\s]+)/);

  if (match) {
    const boundary = match[1];

    const reader = new MultipartReader(
      request.body,
      boundary,
    );

    const form = await reader.readForm(mbToBytes(maxMemory));
    const data: { [key: string]: any } = {};

    for (const [key, value] of form.entries()) {
      data[key] = value;
    }

    return data;
  }

  return;
}

function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}
