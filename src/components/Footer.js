const Footer = () => {
  let d = new Date();
  return (
    <footer>
      <p>Powered by <a href="https://openai.com" referrerPolicy="no-referrer">OpenAI</a>.</p>
      <p>Story Prompt / Lintbox - © <a href="mailto:paul@lintbox.com">Paul R.</a> - {d.getFullYear()}</p>
    </footer>
  )
}

export default Footer;