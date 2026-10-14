"use client"
import React from 'react'

const page = () => {
  const model = process.env.GEMINI_MODEL
  const model2 = process.env.NEXT_PUBLIC_GEMINI_MODEL
  return (
    <div>
      <h1>Modelo: {model}</h1>
      <h1>Modelo2: {model2}</h1>
    </div>
  )
}

export default page