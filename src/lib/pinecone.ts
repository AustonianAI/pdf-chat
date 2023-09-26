import { Pinecone } from "@pinecone-database/pinecone"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"

import { downloadFromS3 } from "./s3-server"

let pinecone: Pinecone | null = null

export const getPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    })
  }

  return pinecone
}

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> download and read from pdf

  console.log("downloading S3 into file system")

  const file_name = await downloadFromS3(fileKey)

  if (!file_name) {
    throw new Error("error downloading from s3")
  }

  const loader = new PDFLoader(file_name)

  const pages = await loader.load()

  return pages
}
