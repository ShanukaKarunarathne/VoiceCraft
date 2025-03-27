document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const uploadArea = document.getElementById('upload-area');
    const audioUpload = document.getElementById('audio-upload');
    const uploadedFileInfo = document.getElementById('uploaded-file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const uploadNext = document.getElementById('upload-next');
    const processBack = document.getElementById('process-back');
    const processNext = document.getElementById('process-next');
    const transcribeBack = document.getElementById('transcribe-back');
    const transcribeNext = document.getElementById('transcribe-next');
    const cloneBack = document.getElementById('clone-back');
    const generateClone = document.getElementById('generate-clone');
    const noiseReductionToggle = document.getElementById('noise-reduction-toggle');
    const playBtn = document.getElementById('play-btn');
    const clonePlayBtn = document.getElementById('clone-play-btn');
    const copyTranscription = document.getElementById('copy-transcription');
    const downloadTranscription = document.getElementById('download-transcription');
    const editTranscription = document.getElementById('edit-transcription');
    const downloadClone = document.getElementById('download-clone');
    const cloneResult = document.getElementById('clone-result');
    const processingModal = document.getElementById('processing-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalDescription = document.getElementById('modal-description');
    const transcriptionResult = document.getElementById('transcription-result');
    const cloneText = document.getElementById('clone-text');

    // State
    let currentStep = 0;
    let audioFile = null;
    let isPlaying = false;
    let isClonePlaying = false;
    let transcriptionText = "This is a sample transcription of the audio file. The advanced AI speech recognition system has converted the spoken words into text with high accuracy. You can copy, download, or edit this transcription as needed.";

    // Initialize
    updateStepIndicators();

    // Event Listeners
    uploadArea.addEventListener('click', () => {
        audioUpload.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    audioUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Navigation buttons
    uploadNext.addEventListener('click', () => {
        goToStep(1);
    });

    processBack.addEventListener('click', () => {
        goToStep(0);
    });

    processNext.addEventListener('click', () => {
        showProcessingModal('Processing audio...', 'Applying noise reduction and enhancing audio quality');
        
        // Simulate processing delay
        setTimeout(() => {
            hideProcessingModal();
            goToStep(2);
        }, 3000);
    });

    transcribeBack.addEventListener('click', () => {
        goToStep(1);
    });

    transcribeNext.addEventListener('click', () => {
        goToStep(3);
    });

    cloneBack.addEventListener('click', () => {
        goToStep(2);
    });

    generateClone.addEventListener('click', () => {
        showProcessingModal('Generating cloned voice...', 'Creating new audio with your voice profile');
        
        // Simulate processing delay
        setTimeout(() => {
            hideProcessingModal();
            cloneResult.classList.remove('hidden');
        }, 4000);
    });

    // Audio controls
    playBtn.addEventListener('click', togglePlayAudio);
    clonePlayBtn.addEventListener('click', togglePlayCloneAudio);

    // Transcription actions
    copyTranscription.addEventListener('click', () => {
        navigator.clipboard.writeText(transcriptionText)
            .then(() => {
                showToast('Transcription copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    });

    downloadTranscription.addEventListener('click', () => {
        const blob = new Blob([transcriptionText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcription.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    editTranscription.addEventListener('click', () => {
        const currentText = transcriptionResult.innerHTML;
        transcriptionResult.innerHTML = `<textarea id="edit-transcription-text" style="width:100%; height:200px;">${transcriptionText}</textarea>
                                         <button id="save-transcription" class="next-btn" style="margin-top:1rem;">Save Changes</button>`;
        
        document.getElementById('save-transcription').addEventListener('click', () => {
            transcriptionText = document.getElementById('edit-transcription-text').value;
            transcriptionResult.innerHTML = transcriptionText;
            showToast('Transcription updated!');
        });
    });

    // Download clone audio
    downloadClone.addEventListener('click', () => {
        // In a real app, this would download the actual generated audio
        showToast('Cloned voice audio downloaded!');
    });

    // Functions
    function handleFileUpload(file) {
        // Check if file is audio
        if (!file.type.startsWith('audio/')) {
            showToast('Please upload an audio file', 'error');
            return;
        }

        audioFile = file;
        fileName.textContent = file.name;
        
        // Format file size
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        fileSize.textContent = `${fileSizeInMB} MB`;
        
        uploadArea.classList.add('hidden');
        uploadedFileInfo.classList.remove('hidden');
    }

    function goToStep(stepIndex) {
        currentStep = stepIndex;
        
        // Update step indicators
        updateStepIndicators();
        
        // Show the current step content
        stepContents.forEach((content, index) => {
            if (index === stepIndex) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Special actions for specific steps
        if (stepIndex === 2) {
            // When entering transcription step, show the transcription
            transcriptionResult.innerHTML = transcriptionText;
        }
    }

    function updateStepIndicators() {
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function togglePlayAudio() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            simulateAudioProgress();
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Stop progress simulation
        }
    }

    function togglePlayCloneAudio() {
        isClonePlaying = !isClonePlaying;
        
        if (isClonePlaying) {
            clonePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            simulateCloneAudioProgress();
        } else {
            clonePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Stop progress simulation
        }
    }

    function simulateAudioProgress() {
        const progressBar = document.querySelector('#process-content .progress');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100 || !isPlaying) {
                clearInterval(interval);
                if (width >= 100) {
                    isPlaying = false;
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                return;
            }
            
            width += 0.5;
            progressBar.style.width = width + '%';
        }, 100);
    }

    function simulateCloneAudioProgress() {
        const progressBar = document.querySelector('#clone-content .progress');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100 || !isClonePlaying) {
                clearInterval(interval);
                if (width >= 100) {
                    isClonePlaying = false;
                    clonePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                return;
            }
            
            width += 0.5;
            progressBar.style.width = width + '%';
        }, 100);
    }

    function showProcessingModal(message, description) {
        modalMessage.textContent = message;
        modalDescription.textContent = description;
        processingModal.classList.add('active');
    }

    function hideProcessingModal() {
        processingModal.classList.remove('active');
    }

    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: var(--success-color);
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .toast.error {
            background-color: var(--error-color);
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
