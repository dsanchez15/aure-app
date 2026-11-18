'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { PageHeader } from '@/components/layout';
import { Button, EmptyState } from '@/components/ui';
import { useAppTranslation } from '@/components/LanguageProvider';
import { useQuestions } from '@/hooks/useQuestions';
import QuestionFilters from '@/components/study/questions/QuestionFilters';
import QuestionCard from '@/components/study/questions/QuestionCard';
import QuestionFormModal from '@/components/study/questions/QuestionFormModal';
import ImportSummaryModal from '@/components/study/questions/ImportSummaryModal';
import type { Question, ImportSummary } from '@/types/study';

export default function QuestionsPage() {
  const { t } = useAppTranslation();
  const {
    questions,
    categories,
    topics,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    applySearch,
    clearFilters,
    saveQuestion,
    deleteQuestion,
    importQuestions,
  } = useQuestions();

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  const handleEdit = (q: Question) => {
    setEditingQuestion(q);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('study.questions.confirmDelete'))) return;
    await deleteQuestion(id);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const summary = await importQuestions(text);
    setImportSummary(summary);
    e.target.value = '';
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-6">
        <PageHeader
          title={t('study.questions.title')}
          description={t('study.questions.subtitle')}
          actions={
            <>
              <Button onClick={handleNew}>
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  add
                </span>
                {t('study.questions.newQuestion')}
              </Button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-control border border-border bg-bg-surface px-4 py-2 font-label text-label-lg text-text-primary transition-state hover:bg-bg-surface-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
                <span aria-hidden="true" className="material-symbols-outlined text-lg">
                  upload
                </span>
                {t('study.questions.importJson')}
                <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
              </label>
            </>
          }
        />

        <QuestionFilters
          filters={filters}
          searchQuery={searchQuery}
          categories={categories}
          topics={topics}
          onFiltersChange={setFilters}
          onSearchChange={setSearchQuery}
          onApplySearch={applySearch}
          onClear={clearFilters}
        />

        <div className="flex flex-col gap-3">
          {questions.length === 0 ? (
            <EmptyState icon="quiz" title={t('study.questions.noQuestions')} />
          ) : (
            questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {showForm && (
          <QuestionFormModal
            question={editingQuestion}
            categories={categories}
            topics={topics}
            onSave={saveQuestion}
            onClose={() => setShowForm(false)}
          />
        )}

        {importSummary && (
          <ImportSummaryModal summary={importSummary} onClose={() => setImportSummary(null)} />
        )}
      </main>
    </AppLayout>
  );
}
