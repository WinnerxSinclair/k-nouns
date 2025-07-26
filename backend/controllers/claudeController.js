import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv'
import User from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js'
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

const CUR_SYSTEM = "You are an expert in the Korean language and at teaching Korean to beginners.";
const CUR_TEXT =           {
            "type": "text",
            "text": `Explain the following text by breaking it into, accurate, meaningful, and sensible components. 
                     State each component and explain it. 
                     Make sure to point out if verbs are conjugated and provide their base form. 
                     Do not include any romanization. 
                     Do not include an intro or outro.
                     Do not summarize at all, only explain the components.
                     Do not lead explanations with 'This'.
                     Do not explain punctuation.
                     Start directly with the first component.
                     Example: '4. **갈래?**\n' + '   - **가다** - Base verb meaning "to go"\n' + '   - **ㄹ래?** - A casual ending used to suggest doing something or to ask if someone wants to do something\n'
                     Text to be explained: ` 
          };

const NEW_SYSTEM = `You are an expert in the Korean language.
                    You receive Korean text and then explain the components of it accurately and succinctly.
                    You always point out if verbs are conjugated and provide their base form.
                    You never use romanization.
                    You never output anything after the last component.
                    Example: '4. **갈래**\n' + '   - **가다** - Base verb meaning "to go"\n' + '   - **ㄹ래** - A casual ending used to suggest doing something or to ask if someone wants to do something\n'
                   `;

const PREFILL = '1.';

const USER_MSG = `Explain the following text by breaking it into, accurate, meaningful, and sensible components. 
                     State each component and explain it. 
                     Example: '4. **갈래?**\n' + '   - **가다** - Base verb meaning "to go"\n' + '   - **ㄹ래** - A casual ending used to suggest doing something or to ask if someone wants to do something\n'`
async function explainHelper(str){
  console.log(str)
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1000,
    temperature: 0.0,
    system: NEW_SYSTEM,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `
              Teacher, please explain the following text by breaking it into, accurate, meaningful, and sensible components.
              Punctuation like question marks are not their own component, and you don't need to explain them.
              Text to be explained: ${str}` 
          }
        ]
      },
      {
        "role": "assistant",
        "content": PREFILL
      }
    ]
  });
  return msg;
}


const translate = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const curTokens = req.profile.tokensUsed;
  if(curTokens < 0) return res.status(403).json({ message: 'not enough tokens' });
  const { front, context } = req.body;
  
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

});

const explain = asyncHandler(async (req, res) => {
  const { back } = req.body;
  const uid = req.profile._id;
  const curTokens = req.profile.tokensUsed;
  if(curTokens < 0) return res.status(403).json({ message: 'not enough tokens' });
  
  const tokenCount = await countTokens(back, EXPLAIN_SYS_MSG);
  if(tokenCount > 120) return res.status(403).json({ message: 'too long' });
  const explanation = await explainHelper(back);
  const outputTokenCount = explanation.usage.output_tokens;
  const userDoc = await User.findByIdAndUpdate(uid, { $inc: { tokensUsed: -outputTokenCount } }, { new: true });
  res.json({ message: `${PREFILL} ${explanation.content[0].text.trim()}`, updatedTokenCount: userDoc.tokensUsed });

});



export default { translate, explain }