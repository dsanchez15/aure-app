'use client'

import { useState } from 'react'
import { Button, Input, Modal, SegmentedControl, Select, Textarea, Toggle } from '@/components/ui'
import { useAppTranslation } from '@/components/LanguageProvider'
import type { Question, QuestionType } from '@/types/study'
import type { QuestionInput } from '@/lib/study/question-service'
import type { CategoryOption } from '@/hooks/useQuestions'

interface QuestionFormModalProps {
  question: Question | null
  categories: CategoryOption[]
  topics: string[]
  onSave: (editingId: string | null, data: QuestionInput) => Promise<void>
  onClose: () => void
}

export default function QuestionFormModal({ question, categories, topics, onSave, onClose }: QuestionFormModalProps) {
  const { t } = useAppTranslation()
  const editingId = question?.id ?? null

  const [questionText, setQuestionText] = useState(question?.question ?? '')
  const [categoryId, setCategoryId] = useState<number | ''>(question?.categoryId ?? '')
  const [topic, setTopic] = useState(question?.topic?.name ?? '')
  const [type, setType] = useState<QuestionType>(question?.type ?? 'direct')
  const [directAnswer, setDirectAnswer] = useState(question?.directAnswer ?? '')
  const [options, setOptions] = useState<string[]>(
    question?.options.length ? question.options : ['', '', '', '']
  )
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(question?.correctOptionIndex ?? null)
  const [supportsBothModes, setSupportsBothModes] = useState(question?.supportsBothModes ?? false)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const validate = (): boolean => {
    if (!questionText.trim()) {
      setFormError(t('study.questions.validation.questionRequired'))
      return false
    }
    if (!categoryId) {
      setFormError(t('study.questions.validation.categoryRequired'))
      return false
    }
    if (!topic.trim()) {
      setFormError(t('study.questions.validation.topicRequired'))
      return false
    }

    const needsDirect = type === 'direct' || supportsBothModes
    const needsMultiple = type === 'multiple-choice' || supportsBothModes

    if (needsDirect && !directAnswer.trim()) {
      setFormError(t('study.questions.validation.answerRequired'))
      return false
    }
    if (needsMultiple) {
      if (options.some((o) => !o.trim())) {
        setFormError(t('study.questions.validation.optionsRequired'))
        return false
      }
      if (correctOptionIndex === null) {
        setFormError(t('study.questions.validation.correctRequired'))
        return false
      }
    }

    setFormError('')
    return true
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave(editingId, {
        question: questionText.trim(),
        categoryId: categoryId === '' ? null : categoryId,
        topic: topic.trim(),
        type: supportsBothModes ? 'multiple-choice' : type,
        directAnswer: directAnswer.trim(),
        options: type === 'multiple-choice' || supportsBothModes ? options.map((o) => o.trim()) : ['', '', '', ''],
        correctOptionIndex: type === 'multiple-choice' || supportsBothModes ? correctOptionIndex : null,
        supportsBothModes,
      })
      onClose()
    } catch {
      setFormError(t('study.questions.validation.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={editingId ? t('study.questions.editQuestion') : t('study.questions.newQuestion')}
      maxWidth="xl"
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Question */}
        <Textarea
          label={t('study.questions.questionLabel')}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder={t('study.questions.questionPlaceholder')}
          rows={3}
          className="resize-none"
        />

        {/* Category + Topic */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label={t('study.questions.categoryLabel')}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === '' ? '' : parseInt(e.target.value))}
          >
            <option value="">{t('study.questions.select')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            label={t('study.questions.topicLabel')}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">{t('study.questions.select')}</option>
            {topics.map((topicName) => (
              <option key={topicName} value={topicName}>
                {topicName}
              </option>
            ))}
          </Select>
        </div>

        {/* Answer type — hidden in dual mode */}
        {!supportsBothModes && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-label text-label-md text-text-secondary">
              {t('study.questions.answerTypeLabel')}
            </legend>
            <SegmentedControl<QuestionType>
              ariaLabel={t('study.questions.answerTypeLabel')}
              fullWidth
              value={type}
              onChange={setType}
              options={[
                { value: 'direct', label: t('study.types.direct') },
                { value: 'multiple-choice', label: t('study.types.multipleChoice') },
              ]}
            />
          </fieldset>
        )}

        {/* Direct answer */}
        {(type === 'direct' || supportsBothModes) && (
          <Input
            label={t('study.questions.directAnswerLabel')}
            value={directAnswer}
            onChange={(e) => setDirectAnswer(e.target.value)}
            placeholder={t('study.questions.directAnswerPlaceholder')}
          />
        )}

        {/* Multiple choice options */}
        {(type === 'multiple-choice' || supportsBothModes) && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-label text-label-md text-text-secondary">{t('study.questions.optionsLabel')}</legend>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOptionIndex(i)}
                  role="radio"
                  aria-checked={correctOptionIndex === i}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border-2 transition-state ${
                    correctOptionIndex === i ? 'border-primary' : 'border-border-strong'
                  }`}
                >
                  {correctOptionIndex === i && <span className="h-2.5 w-2.5 rounded-pill bg-primary" />}
                </button>
                <Input
                  value={opt}
                  onChange={(e) => {
                    const next = [...options]
                    next[i] = e.target.value
                    setOptions(next)
                  }}
                  placeholder={t('study.questions.optionPlaceholder', { letter: String.fromCharCode(65 + i) })}
                />
              </div>
            ))}
          </fieldset>
        )}

        {/* Dual mode */}
        <div
          className={`cursor-pointer rounded-control border p-4 transition-state hover:opacity-90 ${
            supportsBothModes ? 'border-primary/30 bg-primary/10' : 'border-border bg-bg-surface-hover'
          }`}
          onClick={() => setSupportsBothModes(!supportsBothModes)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-lg ${
                  supportsBothModes ? 'text-primary' : 'text-text-muted'
                }`}
              >
                offline_bolt
              </span>
              <div>
                <h4 className="font-label text-label-lg text-text-primary">{t('study.questions.dualMode')}</h4>
                <p className="font-label text-label-md text-text-muted">{t('study.questions.dualModeDesc')}</p>
              </div>
            </div>
            <Toggle
              checked={supportsBothModes}
              onChange={setSupportsBothModes}
              ariaLabel={t('study.questions.dualMode')}
            />
          </div>
        </div>

        {formError && <p className="font-label text-label-lg text-danger">{formError}</p>}

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" fullWidth disabled={saving}>
            {editingId ? t('study.questions.saveChanges') : t('study.questions.createQuestion')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
