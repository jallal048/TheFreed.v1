import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useModals } from '../../contexts/ModalProvider';
import { useData } from '../../contexts/DataProvider';
import { Icon } from '../Icon';
import { Media } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { applyWatermark } from '../../services/geminiService';
import { ToggleSwitch } from '../ToggleSwitch';
import { useLocale } from '../../contexts/LocaleProvider';

type Mode = 'capture' | 'edit' | 'finish' | 'error' | 'posting';
type EditTool = 'none' | 'draw' | 'text';
type Point = { x: number; y: number };
type Path = { id: number; color: string; size: number; points: Point[] };
type TextOverlay = { id: number; text: string; x: number; y: number; color: string; size: number; isEditing?: boolean };
type HistoryItem = { type: 'path'; data: Path } | { type: 'text'; data: TextOverlay };

const colors = ['#FFFFFF', '#EF4444', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#000000'];
const brushSizes = [{ name: 'S', size: 5 }, { name: 'M', size: 12 }, { name: 'L', size: 25 }];

export const AddStoryModal: React.FC = () => {
    const { isAddStoryModalOpen, closeAddStoryModal } = useModals();
    const { addStory } = useData();
    const { currentUser } = useAuth();
    const { t } = useLocale();

    const [mode, setMode] = useState<Mode>('capture');
    const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isNsfw, setIsNsfw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    
    const [editTool, setEditTool] = useState<EditTool>('none');
    const [drawColor, setDrawColor] = useState<string>('#FFFFFF');
    const [brushSize, setBrushSize] = useState<number>(12);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const [draggingText, setDraggingText] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const [editingText, setEditingText] = useState<{id: number, value: string} | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isDrawing = useRef(false);

    const handleClose = useCallback(() => {
        setBaseImage(null);
        setIsNsfw(false);
        setError(null);
        setRetry(0);
        setHistory([]);
        setSelectedTextId(null);
        setEditTool('none');
        setEditingText(null);
        setMode('capture');
        closeAddStoryModal();
    }, [closeAddStoryModal]);

    useEffect(() => {
        let isCancelled = false;
        let currentStream: MediaStream | null = null;
        const startCamera = async () => {
            if (isAddStoryModalOpen && mode === 'capture') {
                setError(null);
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
                    if (isCancelled) { newStream.getTracks().forEach(track => track.stop()); return; }
                    currentStream = newStream;
                    if (videoRef.current) { videoRef.current.srcObject = newStream; videoRef.current.play().catch(e => console.error("Camera play failed", e)); }
                } catch (err) {
                    if (isCancelled) return;
                    setError(t('addStory.cameraGenericError'));
                    setMode('error');
                }
            }
        };
        startCamera();
        return () => {
            isCancelled = true;
            if (currentStream) currentStream.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [isAddStoryModalOpen, mode, facingMode, t, retry]);

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas || !baseImage) return;

        canvas.width = baseImage.naturalWidth;
        canvas.height = baseImage.naturalHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImage, 0, 0);
        
        const paths = history.filter(item => item.type === 'path').map(item => item.data as Path);
        const texts = history.filter(item => item.type === 'text' && !item.data.isEditing).map(item => item.data as TextOverlay);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        paths.forEach(path => {
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.size;
            ctx.beginPath();
            path.points.forEach((point, i) => {
                if (i === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });
        
        texts.forEach(text => {
            ctx.fillStyle = text.color;
            ctx.font = `bold ${text.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = Math.max(2, text.size / 16);

            if (selectedTextId === text.id) {
                ctx.shadowColor = 'rgba(59, 130, 246, 0.9)';
                ctx.shadowBlur = 20;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.strokeText(text.text, text.x, text.y);
            ctx.fillText(text.text, text.x, text.y);
        });

    }, [baseImage, history, selectedTextId]);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'finish') && baseImage) {
            redrawCanvas();
        }
    }, [mode, baseImage, redrawCanvas]);
    
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [editingText?.value]);

    const getCanvasPoint = (clientX: number, clientY: number): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const handleCanvasInteractionStart = (clientX: number, clientY: number) => {
        const point = getCanvasPoint(clientX, clientY);
        if (!point) return;

        if (editTool === 'draw') {
            isDrawing.current = true;
            const newPath: Path = { id: Date.now(), color: drawColor, size: brushSize, points: [point] };
            setHistory(prev => [...prev, { type: 'path', data: newPath }]);
        } else {
            const texts = history.filter(item => item.type === 'text').map(item => item.data as TextOverlay);
            const clickedText = texts.reverse().find(text => {
                const ctx = canvasRef.current?.getContext('2d');
                if (!ctx) return false;
                ctx.font = `bold ${text.size}px sans-serif`;
                const textWidth = ctx.measureText(text.text).width;
                const textHeight = text.size;
                return point.x >= text.x - textWidth / 2 && point.x <= text.x + textWidth / 2 &&
                       point.y >= text.y - textHeight / 2 && point.y <= text.y + textHeight / 2;
            });
            
            if (clickedText) {
                setSelectedTextId(clickedText.id);
                setEditTool('text');
                setDraggingText({ id: clickedText.id, offsetX: point.x - clickedText.x, offsetY: point.y - clickedText.y });
            } else {
                setSelectedTextId(null);
                setEditTool('none');
            }
        }
    };

    const handleCanvasInteractionMove = (clientX: number, clientY: number) => {
        const point = getCanvasPoint(clientX, clientY);
        if (!point) return;

        if (isDrawing.current && editTool === 'draw') {
            setHistory(prev => {
                const newHistory = [...prev];
                const lastItem = newHistory[newHistory.length - 1];
                if (lastItem?.type === 'path') {
                    (lastItem.data as Path).points.push(point);
                }
                return newHistory;
            });
        } else if (draggingText) {
            setHistory(prev => prev.map(item => {
                if (item.type === 'text' && item.data.id === draggingText.id) {
                    const updatedText = item.data as TextOverlay;
                    updatedText.x = point.x - draggingText.offsetX;
                    updatedText.y = point.y - draggingText.offsetY;
                    return { ...item, data: updatedText };
                }
                return item;
            }));
        }
    };

    const handleCanvasInteractionEnd = () => {
        isDrawing.current = false;
        setDraggingText(null);
    };

    const handleDoubleClick = (clientX: number, clientY: number) => {
        if (editTool === 'draw') return;
        const point = getCanvasPoint(clientX, clientY);
        if (!point) return;
        
        const texts = history.filter(item => item.type === 'text').map(item => item.data as TextOverlay);
        const clickedText = texts.reverse().find(text => {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx) return false;
            ctx.font = `bold ${text.size}px sans-serif`;
            const textWidth = ctx.measureText(text.text).width;
            const textHeight = text.size;
            return point.x >= text.x - textWidth / 2 && point.x <= text.x + textWidth / 2 &&
                   point.y >= text.y - textHeight / 2 && point.y <= text.y + textHeight / 2;
        });

        if (clickedText) {
            setHistory(prev => prev.map(item => (item.type === 'text' && item.data.id === clickedText.id) ? { ...item, data: { ...item.data, isEditing: true }} : item));
            setSelectedTextId(clickedText.id);
            setEditTool('text');
            setEditingText({ id: clickedText.id, value: clickedText.text });
        }
    };
    
    const handleAddText = () => {
        if (canvasRef.current) {
            const newText: TextOverlay = {
                id: Date.now(), text: "Escribe aquí", color: '#FFFFFF', size: 64,
                x: canvasRef.current.width / 2, y: canvasRef.current.height / 2, isEditing: true,
            };
            setHistory(prev => [...prev, { type: 'text', data: newText }]);
            setSelectedTextId(newText.id);
            setEditTool('text');
            setEditingText({ id: newText.id, value: newText.text });
        }
    };
    
    const handleDeleteSelected = () => {
        if (!selectedTextId) return;
        setHistory(prev => prev.filter(item => !(item.type === 'text' && item.data.id === selectedTextId)));
        setSelectedTextId(null);
        setEditTool('none');
    };
    
    const handleUndo = () => {
        if (history.length > 0 && history[history.length - 1].data.id === selectedTextId) {
            setSelectedTextId(null);
            setEditTool('none');
        }
        setHistory(prev => prev.slice(0, -1));
    };

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (facingMode === 'user') { ctx.translate(video.videoWidth, 0); ctx.scale(-1, 1); }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            const img = new Image();
            img.onload = () => { setBaseImage(img); setMode('edit'); };
            img.src = canvas.toDataURL('image/jpeg');
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => { setBaseImage(img); setMode('edit'); };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async () => {
        redrawCanvas();
        await new Promise(res => setTimeout(res, 50));
        
        const canvasElement = canvasRef.current;
        if (!canvasElement) { console.error("Canvas element not found"); return; }
        
        const finalImage = canvasElement.toDataURL('image/jpeg', 0.9);
        setMode('posting');
        
        let mediaToPost: Media = { type: 'image', url: finalImage };
        if (currentUser) {
            try { mediaToPost.url = await applyWatermark(finalImage, `TheFreed/@${currentUser.username}`); } 
            catch (e) { console.error("Watermark failed", e); }
        }
        addStory(mediaToPost, isNsfw);
        handleClose();
    };
    
    const selectedText = useMemo(() => history
        .map(h => h.type === 'text' ? h.data : null)
        .find(t => t?.id === selectedTextId) || null, [history, selectedTextId]);

    const editingTextInfo = useMemo(() => history
        .map(h => h.type === 'text' ? h.data : null)
        .find(t => t?.isEditing) || null, [history]);

    const confirmTextEdit = useCallback(() => {
        if (!editingText) return;
        // Update the history with the final text, and turn off editing mode for that item.
        setHistory(prev => prev.map(item => (item.type === 'text' && item.data.id === editingText.id) ? { ...item, data: { ...item.data, text: editingText.value.trim() || ' ', isEditing: false }} : item));
        // Clear the editing state, but keep the text selected and the tool active.
        setEditingText(null);
    }, [editingText]);

    const renderContent = () => {
        if (mode === 'edit') {
            let textEditStyle: React.CSSProperties = { display: 'none' };
            if (editingTextInfo && canvasRef.current) {
                const canvas = canvasRef.current;
                const rect = canvas.getBoundingClientRect();
                const scaleY = rect.height / canvas.height;
                const cssY = rect.top + editingTextInfo.y * scaleY;
                const cssFontSize = editingTextInfo.size * scaleY;
                textEditStyle = {
                    position: 'fixed', top: `${cssY}px`, left: '50%', transform: 'translate(-50%, -50%)',
                    width: '90%', background: 'transparent', border: 'none', color: editingTextInfo.color,
                    fontFamily: 'sans-serif', fontSize: `${cssFontSize}px`, fontWeight: 'bold', textAlign: 'center',
                    resize: 'none', outline: 'none', textShadow: `0 0 8px rgba(0,0,0,1)`, overflow: 'hidden', zIndex: 10,
                };
            }
            return (
                <div className="w-full h-full relative text-white" onMouseUp={handleCanvasInteractionEnd} onTouchEnd={handleCanvasInteractionEnd}>
                    <canvas ref={canvasRef} onMouseDown={(e) => handleCanvasInteractionStart(e.clientX, e.clientY)} onMouseMove={(e) => handleCanvasInteractionMove(e.clientX, e.clientY)} onTouchStart={(e) => handleCanvasInteractionStart(e.touches[0].clientX, e.touches[0].clientY)} onTouchMove={(e) => handleCanvasInteractionMove(e.touches[0].clientX, e.touches[0].clientY)} onDoubleClick={(e) => handleDoubleClick(e.clientX, e.clientY)} className="w-full h-full object-contain" />
                    
                    {editingTextInfo && editingText && (
                        <textarea ref={textareaRef} style={textEditStyle} value={editingText.value} onChange={(e) => editingText && setEditingText(prev => prev ? { ...prev, value: e.target.value } : null)} onBlur={confirmTextEdit} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmTextEdit(); } }} autoFocus />
                    )}

                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <button onClick={() => { setMode('capture'); setBaseImage(null); setHistory([]); setSelectedTextId(null); }}><Icon name="arrow-left" className="w-7 h-7" /></button>
                           <button onClick={() => { setEditTool(t => t === 'draw' ? 'none' : 'draw'); setSelectedTextId(null); }} className={`p-2 rounded-full ${editTool === 'draw' ? 'bg-white text-black' : 'bg-black/40'}`}><Icon name="pencil" className="w-6 h-6"/></button>
                           <button onClick={handleAddText} className={`p-2 rounded-full ${editTool === 'text' ? 'bg-white text-black' : 'bg-black/40'}`}><Icon name="text" className="w-6 h-6"/></button>
                           <button onClick={handleUndo} disabled={history.length === 0} className={`p-2 rounded-full bg-black/40 disabled:opacity-50`}><Icon name="undo" className="w-6 h-6"/></button>
                        </div>
                        <button onClick={() => setMode('finish')} className="bg-white text-black font-bold py-2 px-5 rounded-full flex items-center gap-2">Next <Icon name="arrow-right" className="w-4 h-4" /></button>
                    </div>

                    {editTool === 'text' && selectedText && !editingTextInfo && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-full flex gap-3 items-center">
                           <div className="flex gap-1">{colors.map(color => <button key={color} onClick={() => selectedTextId && setHistory(h => h.map(i => (i.type === 'text' && i.data.id === selectedTextId) ? {...i, data: {...i.data, color}} : i))} className={`w-6 h-6 rounded-full border-2 ${selectedText.color === color ? 'border-white ring-2 ring-offset-2 ring-offset-black/30 ring-white' : 'border-white/50'}`} style={{ backgroundColor: color }} />)}</div>
                           <div className="w-px h-6 bg-white/30"></div>
                            <input
                                type="range"
                                min="32"
                                max="128"
                                value={selectedText.size}
                                onChange={(e) => selectedTextId && setHistory(h => h.map(i => (i.type === 'text' && i.data.id === selectedTextId) ? { ...i, data: { ...i.data, size: parseInt(e.target.value, 10) } } : i))}
                                className="w-24 accent-indigo-500"
                            />
                           <div className="w-px h-6 bg-white/30"></div>
                           <button onClick={handleDeleteSelected} className={`p-2 rounded-full bg-red-500/80`}><Icon name="trash" className="w-5 h-5"/></button>
                        </div>
                    )}
                    
                    {editTool === 'draw' && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm p-2 rounded-full flex gap-3 items-center">
                            <div className="flex gap-1">{colors.map(color => <button key={color} onClick={() => setDrawColor(color)} className={`w-6 h-6 rounded-full border-2 ${drawColor === color ? 'border-white ring-2 ring-offset-2 ring-offset-black/30 ring-white' : 'border-white/50'}`} style={{ backgroundColor: color }} />)}</div>
                            <div className="w-px h-6 bg-white/30"></div>
                            <div className="flex gap-2 items-center">{brushSizes.map(bs => <button key={bs.name} onClick={() => setBrushSize(bs.size)} className={`rounded-full flex items-center justify-center ${brushSize === bs.size ? 'bg-white' : ''}`} style={{ width: `${bs.size + 10}px`, height: `${bs.size + 10}px`}}><div className="bg-gray-400 rounded-full" style={{width: `${bs.size}px`, height: `${bs.size}px`}}></div></button>)}</div>
                        </div>
                    )}
                </div>
            );
        }
        
        if (mode === 'finish') return <div className="w-full h-full relative text-white flex flex-col bg-gray-900"><div className="flex-1 relative flex items-center justify-center overflow-hidden"><canvas ref={canvasRef} className="max-w-full max-h-full object-contain" /></div><div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center"><button onClick={() => setMode('edit')}><Icon name="arrow-left" className="w-7 h-7" /></button></div><div className="p-4 bg-gray-950 flex flex-col gap-4 flex-shrink-0"><label className="flex items-center justify-between cursor-pointer bg-gray-800 p-3 rounded-lg"><span className="font-semibold">{t('addStory.nsfwLabel')}</span><ToggleSwitch checked={isNsfw} onChange={() => setIsNsfw(!isNsfw)} /></label><button onClick={handlePost} className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2"><Icon name="send" className="w-5 h-5"/>{t('addStory.postButton')}</button></div></div>;
        if (mode === 'error') return <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white"><Icon name="ban" className="w-16 h-16 text-red-400 mb-4" /><h3 className="text-xl font-bold">{t('addStory.cameraErrorTitle')}</h3><p className="mt-2 text-gray-300">{error}</p><button onClick={() => { setRetry(r => r + 1); setMode('capture'); }} className="mt-6 bg-white/20 hover:bg-white/30 font-semibold py-2 px-6 rounded-full">{t('addStory.tryAgain')}</button></div>;
        if (mode === 'posting') return <div className="w-full h-full flex items-center justify-center"><svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;
        return <div className="w-full h-full relative"><video ref={videoRef} playsInline muted title={t('addStory.cameraPreview')} className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}></video><div className="absolute top-0 left-0 right-0 p-4 flex justify-end"><button onClick={handleClose} className="text-white" aria-label="Close story creator"><Icon name="close" className="w-8 h-8"/></button></div><div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between"><button onClick={() => fileInputRef.current?.click()} className="text-white" aria-label="Select from gallery"><Icon name="image" className="w-8 h-8"/></button><button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white p-1 flex items-center justify-center" aria-label="Capture photo"><div className="w-full h-full rounded-full border-4 border-black"></div></button><button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} className="text-white" aria-label="Switch camera"><Icon name="arrow-path" className="w-8 h-8" /></button></div></div>;
    };

    return (
        isAddStoryModalOpen ? (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={handleClose}>
                <div className="relative w-full h-full max-w-md max-h-[95vh] bg-gray-800 rounded-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    {renderContent()}
                </div>
            </div>
        ) : null
    );
};