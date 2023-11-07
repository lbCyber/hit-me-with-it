import { useState } from "react";
import Typewriter from 'typewriter-effect';
import responses from '../data/responses.js'; // Halloween's over, so I don't know, maybe shelve this for now?
import Loading from './Loading';

const { OpenAI } = require("openai");

const aiConfig = {
  organization: process.env.REACT_APP_OPENAI_ORG,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // not actually in danger, info is stored in react env
};

const openaiStart = new OpenAI(aiConfig);

const Prompt = () => {
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const [promptCount, setPromptCount] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [typeReady, setTypeReady] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [protag, setProtag] = useState("");
  const [protags, setProtags] = useState([]);

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
        const resPrompt = await res.choices[0].text.replace(/\n/g, "").replace('"',"")
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
    setGenres([...genres, genre])
    setProtags([...protags, protag])
    const prompt = `write a good single line idea for a ${genre} story. The protagonist is ${protag}.`
    const tokenLength = 100;
    const randomness = 1;
    setLoading(true)
    doPrompt();
    setGenre("")
    setProtag("")
  };

  return (
    <form action="#" method="#" name="prompt" className="promptBox" onSubmit={fetchPrompt}>
      <div className="fields">
        <input type="text" id="promptGenre" value={genre} onInput={e=>setGenre(e.target.value)} placeholder="Pick a genre." required />
        <input type="text" id="promptProtag" value={protag} onInput={e=>setProtag(e.target.value)} placeholder="Describe the protagonist." required />
      </div>
      <div className="buttonContainer">
        <button disabled={submitDisabled}>Click here for a prompt</button>
        {loading ? <Loading /> : null}
      </div>
      <div className="promptResponse">
        {
          typeReady ?
          <Typewriter
          options={{
            skipAddStyles: true,
            delay: 35
          }}
          onInit={(typewriter) => {
            typewriter.typeString(promptResult).callFunction(() => {
              setSubmissions([...submissions, promptResult])
            }).start();
          }}
          /> : null
        }
      </div>
    </form>
  )
};

export default Prompt;
