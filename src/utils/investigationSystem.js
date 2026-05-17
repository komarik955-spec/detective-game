import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dt_investigation_progress';

const INITIAL_STAGE = {
  id: 'initial_analysis',
  title: 'Initial Personnel Analysis',
  objective: 'Review all available personnel dossiers.',
  requiredFiles: [
    'selena_black_dossier',
    'evan_underwood_dossier',
    'vesper_wainwright_dossier',
    'marcus_flynn_dossier',
    'alaric_ravenwood_dossier',
    'rosalia_underwood_dossier',
    'michael_elliot_dossier',
    'arthur_payne_dossier',
    'INT-001',
    'INT-002',
    'INT-003',
    'INT-004',
    'INT-005'
  ],

  nextStageId: 'evidence_collection'
};

const STAGES = {
  'initial_analysis': INITIAL_STAGE,
  'evidence_collection': {
    id: 'evidence_collection',
    title: 'Evidence Gathering',
    objective: 'Analyze new evidence photos and emails.',
    requiredFiles: ['evi-001', 'evi-002', 'evi-003'],
    nextStageId: null
  }
};

export const useInvestigation = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      currentStageId: 'initial_analysis',
      reviewedFiles: [],
      completedStages: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const currentStage = STAGES[progress.currentStageId] || INITIAL_STAGE;
  
  const markFileAsReviewed = (fileId) => {
    if (!progress.reviewedFiles.includes(fileId)) {
      const newReviewedFiles = [...progress.reviewedFiles, fileId];
      
      // Check if stage is completed
      const allRequiredReviewed = currentStage.requiredFiles.every(id => 
        newReviewedFiles.includes(id)
      );

      if (allRequiredReviewed && !progress.completedStages.includes(currentStage.id)) {
        // Complete stage
        setProgress(prev => ({
          ...prev,
          reviewedFiles: newReviewedFiles,
          completedStages: [...prev.completedStages, currentStage.id],
          // Trigger progression to next stage if available
          currentStageId: currentStage.nextStageId || prev.currentStageId
        }));
        
        // Dispatch event for other components (like MailApp)
        window.dispatchEvent(new CustomEvent('dt_stage_completed', { 
          detail: { stageId: currentStage.id } 
        }));
      } else {
        setProgress(prev => ({
          ...prev,
          reviewedFiles: newReviewedFiles
        }));
      }
    }
  };

  const getStageProgress = () => {
    if (!currentStage) return 0;
    const reviewedInStage = currentStage.requiredFiles.filter(id => 
      progress.reviewedFiles.includes(id)
    ).length;
    return Math.round((reviewedInStage / currentStage.requiredFiles.length) * 100);
  };

  return {
    progress,
    currentStage,
    markFileAsReviewed,
    stagePercentage: getStageProgress(),
    reviewedCount: currentStage.requiredFiles.filter(id => progress.reviewedFiles.includes(id)).length,
    totalRequired: currentStage.requiredFiles.length
  };
};
