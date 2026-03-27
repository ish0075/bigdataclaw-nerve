import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  FileText, 
  Image as ImageIcon, 
  X, 
  File,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

const PropertyChat = ({ onFormUpdate, formData, onSubmit }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      content: "Hi! I'm your property research assistant. I can help you fill out this form by chatting, uploading documents, or using voice. What property would you like to research today?",
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showFilePreview, setShowFilePreview] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setInputText(finalTranscript)
          handleSendMessage(finalTranscript)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      addMessage('bot', 'Voice control is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const addMessage = (type, content, metadata = {}) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ...metadata
    }
    setMessages(prev => [...prev, newMessage])
  }

  const extractPropertyInfo = (text) => {
    const info = {}
    const lower = text.toLowerCase()

    // Extract address
    const addressMatch = text.match(/(\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd|lane|ln|way|court|ct|circle|cir|trail|trl|parkway|pkwy)\b)/i)
    if (addressMatch) info.address = addressMatch[0]

    // Extract city
    const cityMatch = text.match(/(?:in|at)\s+([A-Za-z\s]+?)(?:,|\s+(?:ontario|on|canada))/i)
    if (cityMatch) info.city = cityMatch[1].trim()

    // Extract price
    const priceMatch = text.match(/\$?([\d,]+(?:\.\d{2})?)\s*(?:million|m|k|thousand)?/i)
    if (priceMatch) {
      let price = parseFloat(priceMatch[1].replace(/,/g, ''))
      if (lower.includes('million') || lower.includes('m ')) price *= 1000000
      if (lower.includes('thousand') || lower.includes('k ')) price *= 1000
      info.price = price
    }

    // Extract asset class
    const assetClasses = ['industrial', 'retail', 'office', 'multi-family', 'agricultural', 'land', 'mixed-use']
    for (const cls of assetClasses) {
      if (lower.includes(cls)) {
        info.assetClass = cls.charAt(0).toUpperCase() + cls.slice(1)
        break
      }
    }

    // Extract size
    const sizeMatch = text.match(/(\d+(?:,\d{3})*)\s*(?:sf|sq\s*ft|square\s*feet)/i)
    if (sizeMatch) info.size = parseInt(sizeMatch[1].replace(/,/g, ''))

    // Extract region
    const regions = ['niagara', 'toronto', 'hamilton', 'gta', 'southwestern ontario']
    for (const region of regions) {
      if (lower.includes(region)) {
        info.region = region.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        break
      }
    }

    return info
  }

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return

    const userMessage = text.trim()
    const lower = userMessage.toLowerCase()
    setInputText('')
    addMessage('user', userMessage)
    setIsLoading(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    const extractedInfo = extractPropertyInfo(userMessage)

    if (Object.keys(extractedInfo).length > 0) {
      // Update form
      onFormUpdate(extractedInfo)

      // Confirm what was extracted
      const confirmations = []
      if (extractedInfo.address) confirmations.push(`📍 Address: ${extractedInfo.address}`)
      if (extractedInfo.city) confirmations.push(`🏙️ City: ${extractedInfo.city}`)
      if (extractedInfo.price) confirmations.push(`💰 Price: $${extractedInfo.price.toLocaleString()}`)
      if (extractedInfo.assetClass) confirmations.push(`🏢 Type: ${extractedInfo.assetClass}`)
      if (extractedInfo.size) confirmations.push(`📐 Size: ${extractedInfo.size.toLocaleString()} SF`)
      if (extractedInfo.region) confirmations.push(`🗺️ Region: ${extractedInfo.region}`)

      if (confirmations.length > 0) {
        addMessage('bot', `I found the following information:\n\n${confirmations.join('\n')}\n\nI've updated the form for you. Anything else you'd like to add?`)
      } else {
        addMessage('bot', "I didn't catch any property details. Try telling me the address, price, and property type. For example: 'I have a $5 million industrial property at 1500 Michael Drive in Welland'")
      }
    } else if (lower.includes('submit') || lower.includes('launch') || lower.includes('start')) {
      addMessage('bot', '🚀 Launching your research mission now!')
      onSubmit()
    } else if (lower.includes('help') || lower.includes('what can you do')) {
      addMessage('bot', `I can help you with:\n\n📝 **Chat**: Tell me about your property in natural language\n📄 **Upload**: PDFs, Word docs, images with property details\n🎙️ **Voice**: Speak to me instead of typing\n\nJust tell me:\n- Property address\n- Asking price\n- Property type (Industrial, Retail, etc.)\n- Location/Region\n- Size (optional)\n\nI'll fill out the form automatically!`)
    } else {
      addMessage('bot', "I'm not sure I understood. You can tell me about a property (address, price, type) or upload documents. Type 'help' for more options.")
    }

    setIsLoading(false)
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    for (const file of files) {
      const fileData = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file
      }

      setUploadedFiles(prev => [...prev, fileData])
      addMessage('user', `📎 Uploaded: ${file.name}`, { file: fileData })

      // Simulate file processing
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock extracted data based on file type
      let extractedData = {}
      let response = ''

      if (file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().includes('om') || file.name.toLowerCase().includes('offering')) {
        extractedData = {
          address: '1500 Michael Drive, Welland',
          city: 'Welland',
          assetClass: 'Industrial',
          price: 5000000,
          size: 80000,
          region: 'Niagara'
        }
        response = `📄 I've analyzed the offering memorandum. Here's what I found:\n\n🏢 **${extractedData.address}**\n💰 $${extractedData.price.toLocaleString()}\n📐 ${extractedData.size.toLocaleString()} SF ${extractedData.assetClass}\n🗺️ ${extractedData.region}\n\nThe form has been filled out with these details!`
      } else if (file.type.startsWith('image/')) {
        response = '🖼️ Image uploaded. I can see this appears to be a commercial property. Please tell me the address and price to complete the form.'
      } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
        response = '📝 Document uploaded and processed. I\'ve extracted property details from the document and updated the form.'
        extractedData = { address: 'Sample Address from Doc', city: 'Sample City', assetClass: 'Industrial' }
      } else {
        response = `📎 File "${file.name}" uploaded. I\'ll include this with your research mission.`
      }

      if (Object.keys(extractedData).length > 0) {
        onFormUpdate(extractedData)
      }

      addMessage('bot', response)
      setIsLoading(false)
    }

    // Reset file input
    event.target.value = ''
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return <FileText className="w-4 h-4 text-accent-red" />
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon className="w-4 h-4 text-accent-green" />
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText className="w-4 h-4 text-accent-blue" />
    return <File className="w-4 h-4 text-text-muted" />
  }

  return (
    <div className="card flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-red" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Property Research Assistant</h3>
            <p className="text-xs text-text-secondary">Chat, upload, or speak to fill out the form</p>
          </div>
        </div>
        {uploadedFiles.length > 0 && (
          <button
            onClick={() => setShowFilePreview(!showFilePreview)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-input text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* File Preview Panel */}
      {showFilePreview && uploadedFiles.length > 0 && (
        <div className="p-3 bg-bg-input border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Attached Files</span>
            <button
              onClick={() => setShowFilePreview(false)}
              className="p-1 rounded hover:bg-bg-card text-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-bg-card">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary truncate">{file.name}</p>
                    <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-accent-red/20 text-text-muted hover:text-accent-red"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' ? 'bg-accent-blue/20' : 'bg-accent-red/20'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-accent-blue" />
              ) : (
                <Sparkles className="w-4 h-4 text-accent-red" />
              )}
            </div>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl whitespace-pre-wrap ${
                message.type === 'user'
                  ? 'bg-accent-blue text-white rounded-br-md'
                  : 'bg-bg-input text-text-primary rounded-bl-md'
              }`}>
                {message.content}
              </div>
              <span className="text-xs text-text-muted mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-red/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-red" />
            </div>
            <div className="bg-bg-input p-3 rounded-2xl rounded-bl-md flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent-red" />
              <span className="text-sm text-text-secondary">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-subtle">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-input text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            Upload PDF, Images, Docs
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Text Input */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-accent-red text-white animate-pulse'
                : 'bg-bg-input text-text-secondary hover:text-text-primary'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening... speak now' : 'Type a message or use voice...'}
              className="w-full input-field pr-12"
              disabled={isLoading}
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-bg-card text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-accent-red text-white hover:bg-accent-red/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Hint */}
        {isListening && (
          <p className="text-xs text-accent-red mt-2 text-center animate-pulse">
            🎙️ Listening... Speak clearly about your property
          </p>
        )}
      </div>
    </div>
  )
}

export default PropertyChat
