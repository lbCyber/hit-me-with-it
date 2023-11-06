import { useEffect, useState } from "react";

const { OpenAI } = require("openai");

const aiConfig = {
  organization: process.env.REACT_APP_OPENAI_ORG,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
};

const openaiStart = new OpenAI(aiConfig);

const Prompt = ({setLoading}) => {
  const [promptResult, setPromptResult] = useState("Prompt will appear here");
  const [timer, setTimer] = useState(0);

  const fetchPrompt = () => {
    const timerTick = () => {
      setTimer(timer - 1000)
      if (timer < 1) {
        clearInterval(timerTick)
      }
    };

    const doTimer = () => { // avoid abuse, only 3 api calls per minute!
      setTimer(10000);
      setInterval(()=>timerTick, 1000)
    }

    async function doPrompt() {
      await openaiStart.completions.create({
        prompt: prompt,
        model: "gpt-3.5-turbo-instruct",
        max_tokens: tokenLength,
        temperature: randomness,
      }).then(async (res) => {
        setPromptResult(res.choices[0].text);
        console.log(promptResult.replace("\n", ""))
      }).finally(()=>{
        setLoading(false);
        doTimer();
      });
    }

    const prompt = "write a good single line idea for a horror story. The protagonist is a robot."
    const tokenLength = 100;
    const randomness = 0;
    setLoading(true)
    setTimeout(()=>{ // Should only run after set time elapsed (max 10 seconds)
      doPrompt();
    }, timer)
  };

  return (
    <>
      <h3 onClick={fetchPrompt}>Click here for a prompt</h3>
      <p>{promptResult}</p>
    </>
  )
};

export default Prompt;
