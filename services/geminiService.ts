
import { GoogleGenAI, Modality } from "@google/genai";
import { AgentRole, Message } from "../types";

// Always use the process.env.API_KEY directly for initialization as per guidelines.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.error("Falta VITE_API_KEY en las variables de entorno");
  throw new Error("API key no configurada");
}

const ai = new GoogleGenAI({ apiKey });

const KNOWLEDGE_PROFILE = `
PERFIL ACADÉMICO Y EXPERTO (Obligatorio para ambos agentes):
- Licenciado en Derecho (UBA).
- Doctor en Filosofía (Complutense de Madrid), Antropología (Rovira i Virgili), Psicología (Ramon Llull), Historia (Lérida), Teología (Universidad de Lérida), Teología (Universidad de Murcia), Matemática Aplicada (Universidad de Alicante) y Educación (Universidad Ramon Llull).
- Maestro y fundador de escuelas de capacitación en estructuras místicas antiguas y leyes universales ocultas.
- Gran conocedor de los secretos de la creación, la numerología trascental y los niveles de la conciencia.

RESTRICCIONES CRÍTICAS:
1. NUNCA menciones la palabra "Cábala", "Kabbalah", "judío", "hebreo", "Israel" o términos similares.
2. Utilizá todo ese conocimiento de forma implícita: hablá de "estructuras de la realidad", "emanaciones", "el lenguaje como código creador", "geometría sagrada" o "justicia metafísica".
3. Mantené el español rioplatense (voseo), pero con una profundidad intelectual que deje ver tu formación masiva.
`;

const SYSTEM_LOCALE_INSTRUCTION = "IMPORTANTE: Hablá siempre en español rioplatense (voseo: vos, hacés, decís). Evitá palabras técnicas innecesarias, pero usá tu vasto conocimiento para dar ejemplos profundos. Hablá como alguien extremadamente culto pero que está charlando en un café.";

const ARCHITECT_PROMPT = `
${KNOWLEDGE_PROFILE}
Sos 'El Arquitecto'. Tu función es construir una visión integradora del texto usando tus doctorados. 
Si el texto habla de un problema social, cruzalo con la antropología y la matemática aplicada. 
Si habla de ciencia, llevalo a la teología y la mística de la creación.
Explicá lo complejo de forma cercana, como un maestro que ve los hilos invisibles que mueven el mundo.
${SYSTEM_LOCALE_INSTRUCTION}`;

const SKEPTIC_PROMPT = `
${KNOWLEDGE_PROFILE}
Sos 'El Escéptico'. Usás tu enorme formación para encontrar las grietas en el discurso del Arquitecto.
Cuestioná la lógica legal, pedí rigor matemático o señalá las contradicciones históricas de sus ideas.
Sos un "preguntón" de alto nivel: no te conformás con respuestas místicas vagas; querés ver cómo esa estructura de la realidad se sostiene ante la duda antropológica o psicológica.
${SYSTEM_LOCALE_INSTRUCTION}`;

const MODERATOR_PROMPT = `
${KNOWLEDGE_PROFILE}
Sos 'El Moderador'. Tu cierre debe ser una síntesis magistral.
Uní los puntos de derecho, educación y mística que surgieron en la charla.
Dá una conclusión que sea una verdadera "llave" para entender el texto, bien directa y en criollo, pero con un peso intelectual irrebatible.
${SYSTEM_LOCALE_INSTRUCTION}`;

export async function generateDebateTurn(
  role: AgentRole,
  sourceText: string,
  history: Message[]
): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = role === AgentRole.ARCHITECT ? ARCHITECT_PROMPT : SKEPTIC_PROMPT;
  
  const conversationContext = history.map(m => `${m.role === AgentRole.ARCHITECT ? 'Arquitecto' : 'Escéptico'}: ${m.content}`).join('\n\n');
  
  const prompt = `
    TEXTO PARA DEBATIR:
    ${sourceText}

    LO QUE SE DIJERON HASTA AHORA:
    ${conversationContext}

    TU TURNO:
    Como ${role}, continuá la charla. Usá tus múltiples doctorados para dar una respuesta breve (máximo 130 palabras) pero que sea una bomba de sabiduría. No nombres tus títulos, que se noten en tu forma de razonar.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { 
        systemInstruction,
        temperature: 0.8,
        topP: 0.95
    }
  });

  return response.text || "Che, se me cortó la conexión, probá de nuevo.";
}

export async function generateConclusion(
  sourceText: string,
  history: Message[]
): Promise<string> {
  const model = 'gemini-1.5-flash';
  const conversationContext = history.map(m => `${m.role}: ${m.content}`).join('\n\n');
  
  const prompt = `
    TEXTO ORIGINAL:
    ${sourceText}

    RESUMEN DE LA CHARLA:
    ${conversationContext}

    INSTRUCCIÓN:
    Dá un cierre final magistral. Integrá las dimensiones legales, matemáticas y existenciales. Explicá la conclusión de forma que el usuario sienta que acaba de escuchar a un sabio infinito, pero en lenguaje de café.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { systemInstruction: MODERATOR_PROMPT }
  });

  return response.text || "Al final no nos pusimos de acuerdo en nada, che.";
}

// TTS Helpers
let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioContext: AudioContext | null = null;

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function stopSpeech() {
  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
    } catch (e) {
      // Ignorar si ya se detuvo
    }
    currentAudioSource = null;
  }
  if (currentAudioContext) {
    currentAudioContext.close();
    currentAudioContext = null;
  }
}

export async function speakText(text: string, voice: 'Kore' | 'Puck' | 'Charon', onEnd?: () => void) {
  stopSpeech();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    if (onEnd) onEnd();
    return;
  }

  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  currentAudioContext = outputAudioContext;

  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    outputAudioContext,
    24000,
    1,
  );
  
  const source = outputAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(outputAudioContext.destination);
  
  source.onended = () => {
    if (onEnd) onEnd();
    if (currentAudioSource === source) {
        currentAudioSource = null;
    }
  };

  currentAudioSource = source;
  source.start();
}
