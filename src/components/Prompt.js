import { useState } from "react";
import Typewriter from 'typewriter-effect';
import responses from '../data/responses.js';
import Loading from './Loading';

const { OpenAI } = require("openai");

const aiConfig = {
  organization: process.env.REACT_APP_OPENAI_ORG,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
};

const openaiStart = new OpenAI(aiConfig);

const Prompt = () => {
  const [loading, setLoading] = useState(true);
  const [promptResult, setPromptResult] = useState("");
  const [promptCount, setPromptCount] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [typeReady, setTypeReady] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [genre, setGenre] = useState("")
  const [protag, setProtag] = useState("")

  const fetchPrompt = (e) => {
    e.preventDefault();

    const doTimer = () => { // avoid abuse, only 3 api calls per minute!
      setTimeout(()=>{setSubmitDisabled(false)}, 10000);
    }

    const doPrompt = () => {
      setSubmitDisabled(true);
      setPromptResult("")
      setTypeReady(false)
      openaiStart.completions.create({
        prompt: prompt,
        model: "gpt-3.5-turbo-instruct",
        max_tokens: tokenLength,
        temperature: randomness,
      }).then(async (res, rej) => {
        const resPrompt = await res.choices[0].text.replace(/"\n/g, "")
        if (typeof resPrompt === "string") {
          setPromptCount(promptCount + 1);
          setPromptResult(resPrompt);
        } else {
          throw new Error(`Something went wrong: ${rej}`);
        }
      }).catch((err)=>{
        alert(err);
      }).finally(()=>{
        setLoading(false);
        setTypeReady(true)
        doTimer();
      });
    }

    const prompt = `write a good single line idea for a ${genre} story. The protagonist is ${protag}.`
    const tokenLength = 100;
    const randomness = 0;
    setLoading(true)
    doPrompt();
  };

  return (
    <div className="promptBox">
      <div className="fields">
        <input type="text" id="promptGenre" value={genre} onInput={e=>setGenre(e.target.value)} placeholder="Pick a genre." />
        <input type="text" id="promptProtag" value={protag} onInput={e=>setProtag(e.target.value)} placeholder="Describe the protagonist." />
      </div>
      <div className="buttonContainer">
        <button onClick={fetchPrompt} disabled={submitDisabled}>Click here for a prompt</button>
        {loading ? <Loading /> : null}
      </div>
      {
        typeReady ?
        <Typewriter
          options={{
            skipAddStyles: true,
            delay: 35
          }}
          onInit={(typewriter) => {
            typewriter.typeString(promptResult).callFunction(() => {
              setSubmissions([...promptResult])
            }).start();
          }}
        /> : null
      }
    </div>
  )
};

export default Prompt;
