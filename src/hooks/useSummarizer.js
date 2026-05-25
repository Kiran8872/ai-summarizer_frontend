import { useCallback, useState } from 'react';
import { summarize, uploadFile } from '../api/client';
import { countWords } from '../utils/wordCount';
import { saveToHistory } from '../utils/historyStorage';

export function useSummarizer({ onSuccess, onError }) {
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryType, setSummaryType] = useState('bullet');
  const [tone, setTone] = useState('simple');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [inputWords, setInputWords] = useState(0);
  const [outputWords, setOutputWords] = useState(0);
  const [compression, setCompression] = useState(0);
  const [fileName, setFileName] = useState('');

  const updateText = useCallback((text) => {
    setInputText(text);
    setInputWords(countWords(text));
  }, []);

  const updateUrl = useCallback((value) => {
    setUrl(value);
  }, []);

  const upload = useCallback(
    async (file, errMsg) => {
      if (errMsg) {
        onError?.(errMsg);
        return;
      }
      setUploadLoading(true);
      try {
        const data = await uploadFile(file);
        updateText(data.extractedText);
        setFileName(data.fileName);
        onSuccess?.(`Loaded "${data.fileName}" (${data.wordCount.toLocaleString()} words)`);
        return data;
      } catch (err) {
        onError?.(err.message);
      } finally {
        setUploadLoading(false);
      }
    },
    [updateText, onSuccess, onError]
  );

  const generate = useCallback(async () => {
    if (!inputText.trim() && !url.trim()) {
      onError?.('Text is empty. Please paste content, upload a file, or provide a URL.');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const data = await summarize({ inputText, url, summaryType, tone, length });
      setSummary(data.summary);
      setOutputWords(data.stats.outputWordCount);
      setCompression(data.stats.compressionPercent);
      setInputWords(data.stats.inputWordCount);

      saveToHistory({
        summary: data.summary,
        summaryType,
        tone,
        length,
        inputPreview: (url && url.trim()) ? url : inputText.slice(0, 120),
        stats: data.stats,
      });

      onSuccess?.('Summary generated successfully!');
      return { ...data, stats: data.stats };
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [inputText, summaryType, tone, length, onSuccess, onError]);

  const clear = useCallback(() => {
    setInputText('');
    setSummary('');
    setInputWords(0);
    setOutputWords(0);
    setCompression(0);
    setFileName('');
  }, []);

  return {
    inputText,
    url,
    summary,
    summaryType,
    setSummaryType,
    tone,
    setTone,
    length,
    setLength,
    loading,
    uploadLoading,
    inputWords,
    outputWords,
    compression,
    fileName,
    updateText,
    updateUrl,
    upload,
    generate,
    clear,
    charCount: inputText.length,
  };
}
