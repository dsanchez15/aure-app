'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import PlanningView from '@/components/PlanningView';
import ActionView from '@/components/ActionView';
import ArchiveView from '@/components/ArchiveView';
import { PageHeader } from '@/components/layout';
import { Button, Card, SegmentedControl } from '@/components/ui';
import { useAppTranslation } from '@/components/LanguageProvider'
import { Habit, Category, Objective, HabitFormData, HabitState } from '@/types/habit';

type ViewTab = 'planning' | 'action' | 'archive';

export default function HabitsPage() {
    const { t } = useAppTranslation();
    const [activeTab, setActiveTab] = useState<ViewTab>('action');
    const [habits, setHabits] = useState<Habit[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            const [habitsRes, catsRes, objsRes] = await Promise.all([
                fetch('/api/habits'),
                fetch('/api/habits/categories'),
                fetch('/api/habits/objectives'),
            ]);

            if (!habitsRes.ok) throw new Error(t('habits.errors.fetchHabits'));
            if (!catsRes.ok) throw new Error(t('habits.errors.fetchCategories'));
            if (!objsRes.ok) throw new Error(t('habits.errors.fetchObjectives'));

            const [habitsData, catsData, objsData] = await Promise.all([
                habitsRes.json(),
                catsRes.json(),
                objsRes.json(),
            ]);

            setHabits(habitsData);
            setCategories(catsData);
            setObjectives(objsData);
            setError('');
        } catch (err) {
            setError(t('habits.errors.loadData'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const handleCreateHabit = async (data: HabitFormData) => {
        const response = await fetch('/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(t('habits.errors.create'));
        await fetchHabits();
    };

    const handleUpdateHabit = async (id: number, data: HabitFormData) => {
        const response = await fetch(`/api/habits/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(t('habits.errors.update'));
        await fetchHabits();
    };

    const handleDeleteHabit = async (id: number) => {
        const response = await fetch(`/api/habits/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(t('habits.errors.deleteHabit'));
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const handleStateChange = async (id: number, state: HabitState) => {
        const response = await fetch(`/api/habits/${id}/state`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state }),
        });
        if (!response.ok) throw new Error(t('habits.errors.changeState'));
        await fetchHabits();
    };

    const handleToggleCompletion = async (id: number, date: string, completed: boolean) => {
        if (completed) {
            const response = await fetch(`/api/habits/${id}/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }),
            });
            if (!response.ok) {
                const err = await response.json();
                alert(err.message || t('habits.errors.complete'));
                throw new Error(err.error);
            }
            const data = await response.json();
            await fetchHabits();
            return data;
        } else {
            const response = await fetch(`/api/habits/${id}/completions?date=${date}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(t('habits.errors.deleteCompletion'));
            await fetchHabits();
            return null;
        }
    };

    const tabs: { id: ViewTab; label: string }[] = [
        { id: 'action', label: t('habits.tabs.action') },
        { id: 'planning', label: t('habits.tabs.planning') },
        { id: 'archive', label: t('habits.tabs.archive') },
    ];

    return (
        <AppLayout>
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                <PageHeader title={t('habits.title')} description={t('habits.myHabits')} />

                <Card padding="lg" className="flex flex-col gap-5">
                    <SegmentedControl<ViewTab>
                        ariaLabel={t('habits.title')}
                        options={tabs.map((tab) => ({ value: tab.id, label: tab.label }))}
                        value={activeTab}
                        onChange={setActiveTab}
                    />

                    {error && (
                        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-card border border-danger/30 bg-danger/10 p-4">
                            <p className="flex-1 font-label text-label-md text-danger">{error}</p>
                            <Button size="sm" variant="secondary" onClick={fetchHabits}>
                                {t('habits.retry')}
                            </Button>
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <PlanningView
                            habits={habits}
                            categories={categories}
                            objectives={objectives}
                            onCreate={handleCreateHabit}
                            onUpdate={handleUpdateHabit}
                            onDelete={handleDeleteHabit}
                            onStateChange={handleStateChange}
                            loading={loading}
                        />
                    )}

                    {activeTab === 'action' && (
                        <ActionView
                            habits={habits}
                            onToggleCompletion={handleToggleCompletion}
                            loading={loading}
                        />
                    )}

                    {activeTab === 'archive' && (
                        <ArchiveView
                            habits={habits}
                            loading={loading}
                        />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
