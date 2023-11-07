const Footer = () => {
  let d = new Date();
  return (
    <footer>
      <p>Powered by <a href="https://openai.com" referrerPolicy="no-referrer">OpenAI</a>. </p>
      <p>Story Prompt / Lintbox © {d.getFullYear()} - <a href="mailto:paul@lintbox.com">Paul R.</a></p>
    </footer>
  )
}

export default Footer;