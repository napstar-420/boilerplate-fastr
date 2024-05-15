import type { FormData as FormDataType, Headers as HeadersType, Request as RequestType, Response as ResponseType } from 'undici';

declare global {
  export const { FormData, Headers, Request, Response, fetch }: typeof import('undici');

  type FormData = FormDataType;
  type Headers = HeadersType;
  type Request = RequestType;
  type Response = ResponseType;
}
