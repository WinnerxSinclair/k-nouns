import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv'
import User from '../models/user.js'
dotenv.config();
const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TRANSLATE_SYS_MSG = "You are an expert in the Korean language and at translating English into natural, native Korean.";
const EXPLAIN_SYS_MSG = "You are an expert in the Korean language and at teaching Korean to beginners.";
async function countTokens(prompt, sysMsg){
  const response = await anthropic.messages.countTokens({
    model: "claude-3-7-sonnet-20250219",
    system: sysMsg,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt
          }
        ]
      }
    ]
  });
  return response.input_tokens;
}

async function buildTranslateMessage(str, context){
  const hasContext = context ? ` Use the appropriate speech level, tone, and honorifics based on the provided context, considering Korean social and situational norms. For example, adjust formality based on differences in age, familiarity, and hierarchy — e.g., use gentle casual speech to a child, or polite formal to an elder.` 
                             : '';
  const pieceOne = "Translate the following text into natural, native Korean.";
  const pieceTwo = " Take time to think about this, to nail every little nuance. Never output an explanation, only the translation.\n";
  const pieceThree = context ? `Context: ${context}\n` : '';
  const pieceFour = `Text: ${str}`;
  const prompt = pieceOne + hasContext + pieceTwo + pieceThree + pieceFour;
  return prompt;
}


async function translateHelper(prompt){
  
  console.log(prompt)
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1000,
    temperature: 0.2,
    system: "You are an expert in the Korean language and at translating English into natural, native Korean.",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt
          }
        ]
      }
    ]
  });
  
  return msg;
}

async function explainHelper(str){
  console.log(str)
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1000,
    temperature: 0.2,
    system: "You are an expert in the Korean language and at teaching Korean to beginners.",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `Explain the following text by breaking it into, accurate, meaningful, and sensible components. 
                     State each component and explain it. 
                     Make sure to point out if verbs are conjugated and provide their base form. 
                     Do not include any romanization. 
                     Do not include an intro or outro/overall analysis.
                     Do not lead explanations with 'This'.
                     Puncuation are NOT components.
                     Start directly with the first component.
                     Example: '4. **갈래?**\n' + '   - **가다** - Base verb meaning "to go"\n' + '   - **ㄹ래?** - A casual ending used to suggest doing something or to ask if someone wants to do something\n'
                     Text to be explained: ${str}` 
          }
        ]
      },
    ]
  });
  console.log(msg)
  return msg;
}


const translate = async (req, res) => {
  const uid = req.profile._id;
  const curTokens = req.profile.tokensUsed;
  if(curTokens < 0) return res.status(403).json({ message: 'not enough tokens' });
  const { front, context } = req.body;
  try{
    const prompt = await buildTranslateMessage(front, context);
    const tokenCount = await countTokens(prompt, TRANSLATE_SYS_MSG);
    console.log(tokenCount);
    if(tokenCount > 900) return res.status(403).json({ message: 'too many tokens' });
    const translated = await translateHelper(prompt);
    console.log(translated);
    const translated_extracted = translated.content[0].text;
    const outputTokenCount = translated.usage.output_tokens;
    const userDoc = await User.findByIdAndUpdate(uid, { $inc: { tokensUsed: -outputTokenCount } }, { new: true });
    res.json({ message: translated_extracted, updatedTokenCount: userDoc.tokensUsed });
  }catch(err){
    console.log(err);
    res.json(err);
  }
}

const explain = async (req, res) => {
  const { back } = req.body;
  const uid = req.profile._id;
  const curTokens = req.profile.tokensUsed;
  if(curTokens < 0) return res.status(403).json({ message: 'not enough tokens' });
  try{
    const tokenCount = await countTokens(back, EXPLAIN_SYS_MSG);
    if(tokenCount > 120) return res.status(403).json({ message: 'too long' });
    const explanation = await explainHelper(back);
    const outputTokenCount = explanation.usage.output_tokens;
    const userDoc = await User.findByIdAndUpdate(uid, { $inc: { tokensUsed: -outputTokenCount } }, { new: true });
    res.json({ message: explanation.content[0].text, updatedTokenCount: userDoc.tokensUsed });
  }catch(err){
    console.log(err);
    res.json(err);
  }
}



export default { translate, explain }