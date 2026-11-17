'use client';

import AppLayout from '@/components/AppLayout';
import { PageHeader } from '@/components/layout';
import { useAppTranslation } from '@/components/LanguageProvider';
import { useStudySession } from '@/hooks/useStudySession';
import SessionConfigView from '@/components/study/review/SessionConfigView';
import ActiveSessionView from '@/components/study/review/ActiveSessionView';
import SessionSummaryView from '@/components/study/review/SessionSummaryView';
import ResumeSessionBanner from '@/components/study/review/ResumeSessionBanner';

export default function ReviewPage() {
  const { t } = useAppTranslation();
  const studySession = useStudySession(t);

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-6">
        <PageHeader title={t('study.review.title')} description={t('study.review.subtitle')} />

        {studySession.showResumeDialog && (
          <ResumeSessionBanner
            session={studySession.session}
            onResume={studySession.resumeSession}
            onDiscard={studySession.discardSession}
          />
        )}

        {studySession.view === 'config' && (
          <SessionConfigView
            config={studySession.config}
            topics={studySession.topics}
            maxQuestions={studySession.maxQuestions}
            filteredCount={studySession.filteredCount}
            isConfigValid={studySession.isConfigValid}
            onConfigChange={studySession.setConfig}
            onStart={studySession.startSession}
          />
        )}

        {studySession.view === 'active' && studySession.currentQuestion && studySession.session && (
          <ActiveSessionView
            session={studySession.session}
            question={studySession.currentQuestion}
            mode={studySession.currentMode}
            timeLeft={studySession.timeLeft}
            userAnswer={studySession.userAnswer}
            selectedOption={studySession.selectedOption}
            showFeedback={studySession.showFeedback}
            isCorrect={studySession.isCorrect}
            onUserAnswerChange={studySession.setUserAnswer}
            onSelectOption={studySession.setSelectedOption}
            onSubmit={() => studySession.submitAnswer()}
            onContinue={studySession.continueToNext}
            onAbandon={studySession.abandonSession}
          />
        )}

        {studySession.view === 'summary' && studySession.result && (
          <SessionSummaryView
            result={studySession.result}
            previousResult={studySession.previousResult}
            onNewSession={studySession.resetToConfig}
          />
        )}
      </main>
    </AppLayout>
  );
}
