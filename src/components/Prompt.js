import { useState } from "react";
import Typewriter from "typewriter-effect";
import responses from "../data/responses.js"; // Halloween's over, so I don't know, maybe shelve this for now?
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSwatchbook, faPersonRays } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";

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
  const [cycle, setCycle] = useState(0);

  const incCycle = () => {
    if ((cycle === 0 && genre.length !== 0) || (cycle === 1 && protag.length !== 0)) {
      if (cycle < 2) {
        setCycle(cycle + 1);
      }
    }
  };

  const decCycle = () => {
    if (cycle > 0 && cycle !== 2) {
      setCycle(cycle - 1);
    } else if (cycle === 2) {
      setCycle(0);
      setProtag("");
      setGenre("");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (cycle === 0) {
      incCycle()
    } else if (cycle === 1) {
      fetchPrompt(e)
    }
  }

  const fetchPrompt = (e) => {
    e.preventDefault();
    incCycle();
    const doTimer = () => {
      // avoid abuse, only 3 api calls per minute!
      setTimeout(() => {
        setSubmitDisabled(false);
      }, 10000);
    };

    const doPrompt = () => {
      const prompt = `write a good single line idea for a ${genre} story. The protagonist is ${protag}.`;
      const tokenLength = 100;
      const randomness = 1;
      setSubmitDisabled(true);
      setPromptResult("");
      setTypeReady(false);
      setGenres([...genres, genre]);
      setProtags([...protags, protag]);
      setLoading(true);
      openaiStart.completions
        .create({
          prompt: prompt,
          model: "gpt-3.5-turbo-instruct",
          max_tokens: tokenLength,
          temperature: randomness,
        })
        .then(async (res, rej) => {
          const resPrompt = await res.choices[0].text.replace(/[\n"]/g, "");
          if (typeof resPrompt === "string") {
            setPromptCount(promptCount + 1);
            setPromptResult(resPrompt);
          } else {
            throw new Error(`Something went wrong: ${rej}`);
          }
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => {
          setLoading(false);
          setTypeReady(true);
          doTimer();
        });
    };
    doPrompt();
  };

  return (
    <form action="#" method="#" name="prompt" className="promptBox">
      <div className="wrapper">
        <div className="entries">
          <p className={cycle > 0 ? "entryVis" : ""}>Genre: <span className="entryContent">{genre}</span></p>
          <p className={cycle > 1 ? "entryVis" : ""}>Protagonist: <span className="entryContent">{protag}</span></p>
        </div>
      </div>
      <div className={`promptSlider${cycle !== 2 ? " canTransition" : ""}`} style={{left: `${cycle * -100}vw`}}>
        <div className="promptSelectionContainer">
          <div className="wrapper promptFlex field">
            <div className="genreBox fieldBox">
              <input
                type="text"
                id="promptGenre"
                value={genre}
                onInput={(e) => setGenre(e.target.value)}
                onKeyDown={(e) => (e.keyCode === 13 || e.keycode === 9) ? submitHandler(e) : null}
                placeholder="a genre"
                required />
              <div className="fieldImg">
                <FontAwesomeIcon icon={faSwatchbook} />
              </div>
            </div>
            <div className="buttonContainer ok">
              <p className="formButton ok" disabled={submitDisabled} onClick={submitHandler}>OK!</p>
            </div>
          </div>
        </div>
        <div className="promptSelectionContainer">
          <div className="wrapper promptFlex field">
            <div className="protagBox fieldBox">
              <input
                type="text"
                id="promptProtag"
                value={protag}
                onInput={(e) => setProtag(e.target.value)}
                onKeyDown={(e) => (e.keyCode === 13 || e.keycode === 9) ? submitHandler(e) : null}
                placeholder="and a protagonist"
                required />
              <div className="fieldImg">
                <FontAwesomeIcon icon={faPersonRays} />
              </div>
            </div>
            <div className="buttons">
              <div className="buttonContainer back">
                <p className="formButton back" onClick={decCycle}>Back</p>
              </div>
              <div className="buttonContainer ok">
                <p className="formButton ok" disabled={submitDisabled} onClick={submitHandler}>OK!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="promptSelectionContainer">
          <div className="wrapper promptFlex">
            <div className="promptResponse">
              {loading ? <Loading /> : null}
              {typeReady ? (
                <Typewriter
                  options={{
                    skipAddStyles: true,
                    delay: 35,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(promptResult)
                      .callFunction(() => {
                        setSubmissions([...submissions, promptResult]);
                      })
                      .start();
                  }}
                />
              ) : null}
            </div>
            <div className="buttonContainer back">
              <p className="formButton" onClick={decCycle}>Start Over</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Prompt;
