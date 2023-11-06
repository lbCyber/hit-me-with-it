import { useEffect, useState } from "react";

const { OpenAI } = require("openai");

const aiConfig = {
  organization: process.env.REACT_APP_OPENAI_ORG,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
};

const openaiStart = new OpenAI(aiConfig);

const Prompt = (setIsLoading) => {
  const [promptResult, setPromptResult] = useState("Prompt will appear here");

  async function fetchPrompt() {
    setIsLoading(true)
    const prompt = "write a good single line idea for a horror story. The protagonist is a robot."
    const tokenLength = 100;
    const randomness = 0;
    await openaiStart.completions.create({
      prompt: prompt,
      model: "gpt-3.5-turbo-instruct",
      max_tokens: tokenLength,
      temperature: randomness,
    }).then((res) => {
      setPromptResult(res.choices[0].text);
      console.log(promptResult.replace("\n", ""))
    }).finally(()=>setIsLoading(false));
  }
  return (
    <>
      <h3 onClick={fetchPrompt}>Click here for a prompt</h3>
      <p>{promptResult}</p>
    </>
  )
};

export default Prompt;
