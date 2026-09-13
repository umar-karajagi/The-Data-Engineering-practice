'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ArrowUpRight, 
  Plus, 
  Link as LinkIcon,
  CheckCircle2,
  BookOpen,
  Layers,
  MapPin
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';
import { LinkedRef } from '../../types';

export const TodosView: React.FC<{
  onNavigateToTarget?: (ref: LinkedRef) => void;
}> = ({ onNavigateToTarget }) => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useUserStore();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'today' | 'overdue'>('all');
  const [newText, setNewText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newTargetType, setNewTargetType] = useState<'' | 'track' | 'module' | 'book' | 'roadmap_node'>('');
  const [newTargetTitle, setNewTargetTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTodos = todos.filter(t => {
    if (filterTab === 'active' && t.done) return false;
    if (filterTab === 'completed' && !t.done) return false;
    if (filterTab === 'today') {
      return t.dueDate === todayStr;
    }
    if (filterTab === 'overdue') {
      return !t.done && t.dueDate && t.dueDate < todayStr;
    }
    return true;
  });

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    let linkedRef: LinkedRef | undefined = undefined;
    if (newTargetType && newTargetTitle.trim()) {
      linkedRef = {
        type: newTargetType,
        id: `target-${Date.now()}`,
        title: newTargetTitle.trim()
      };
    }

    addTodo({
      text: newText.trim(),
      dueDate: newDueDate || undefined,
      linkedRef
    });

    setNewText('');
    setNewDueDate('');
    setNewTargetType('');
    setNewTargetTitle('');
    setIsAdding(false);
  };

  const getTargetIcon = (type?: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'module':
      case 'track': return Layers;
      case 'roadmap_node': return MapPin;
      default: return LinkIcon;
    }
  };

  const totalCount = todos.length;
  const activeCount = todos.filter(t => !t.done).length;
  const completedCount = todos.filter(t => t.done).length;
  const overdueCount = todos.filter(t => !t.done && t.dueDate && t.dueDate < todayStr).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-track-python/10 border border-track-python/30 flex items-center justify-center text-track-python">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-forge-text tracking-tight">Personal Study Todos</h1>
              <p className="text-xs text-forge-secondary font-mono">
                Self-authored learning goals • Link tasks to specific tracks, modules, or books
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-track-python text-black font-bold text-xs hover:bg-track-python/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Task'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-forge-card border border-forge-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-secondary font-mono block">Total Tasks</span>
            <span className="text-lg font-bold text-forge-text">{totalCount}</span>
          </div>
          <CheckSquare className="w-5 h-5 text-forge-secondary opacity-40" />
        </div>
        <div className="p-3.5 rounded-xl bg-forge-card border border-forge-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-secondary font-mono block">Active</span>
            <span className="text-lg font-bold text-amber-400">{activeCount}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400 opacity-40" />
        </div>
        <div className="p-3.5 rounded-xl bg-forge-card border border-forge-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-secondary font-mono block">Completed</span>
            <span className="text-lg font-bold text-track-python">{completedCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-track-python opacity-40" />
        </div>
        <div className="p-3.5 rounded-xl bg-forge-card border border-forge-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forge-secondary font-mono block">Overdue</span>
            <span className="text-lg font-bold text-red-400">{overdueCount}</span>
          </div>
          <AlertCircle className="w-5 h-5 text-red-400 opacity-40" />
        </div>
      </div>

      {/* Add Task Form (collapsible) */}
      {isAdding && (
        <form onSubmit={handleCreateTodo} className="rounded-2xl bg-forge-card border border-forge-border p-5 space-y-4 shadow-lg animate-in fade-in duration-150">
          <h3 className="text-xs font-bold text-forge-text font-mono uppercase tracking-wider">Create New Task</h3>
          
          <div>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="What do you plan to learn or practice? (e.g. Finish PySpark Module 4 test by Friday)"
              autoFocus
              className="w-full bg-forge-bg border border-forge-border rounded-xl px-3.5 py-2 text-xs text-forge-text placeholder:text-forge-secondary focus:outline-none focus:border-track-python font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Due date picker */}
            <div>
              <label className="text-[10px] font-mono text-forge-secondary block mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-forge-bg border border-forge-border rounded-lg px-2.5 py-1.5 text-xs text-forge-text focus:outline-none focus:border-track-python"
              />
            </div>

            {/* Target type linker */}
            <div>
              <label className="text-[10px] font-mono text-forge-secondary block mb-1">Link to Content (Optional)</label>
              <select
                value={newTargetType}
                onChange={(e) => setNewTargetType(e.target.value as any)}
                className="w-full bg-forge-bg border border-forge-border rounded-lg px-2.5 py-1.5 text-xs text-forge-text focus:outline-none focus:border-track-python"
              >
                <option value="">None (General task)</option>
                <option value="module">Track Module</option>
                <option value="book">Vault Book</option>
                <option value="roadmap_node">Roadmap Topic</option>
              </select>
            </div>

            {/* Target Title */}
            {newTargetType && (
              <div>
                <label className="text-[10px] font-mono text-forge-secondary block mb-1">Target Name</label>
                <input
                  type="text"
                  value={newTargetTitle}
                  onChange={(e) => setNewTargetTitle(e.target.value)}
                  placeholder="e.g. PySpark Module 2"
                  className="w-full bg-forge-bg border border-forge-border rounded-lg px-2.5 py-1.5 text-xs text-forge-text focus:outline-none focus:border-track-python"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-forge-border">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-forge-secondary hover:text-forge-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newText.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-track-python text-black hover:bg-track-python/90 disabled:opacity-50"
            >
              Add to Task List
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-forge-card border border-forge-border rounded-xl font-mono text-xs w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterTab === 'all' ? 'bg-forge-surface text-track-python shadow-sm' : 'text-forge-secondary hover:text-forge-text'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setFilterTab('active')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterTab === 'active' ? 'bg-forge-surface text-track-python shadow-sm' : 'text-forge-secondary hover:text-forge-text'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilterTab('today')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterTab === 'today' ? 'bg-forge-surface text-track-python shadow-sm' : 'text-forge-secondary hover:text-forge-text'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilterTab('overdue')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterTab === 'overdue' ? 'bg-forge-surface text-red-400 shadow-sm' : 'text-forge-secondary hover:text-forge-text'
          }`}
        >
          Overdue ({overdueCount})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterTab === 'completed' ? 'bg-forge-surface text-track-python shadow-sm' : 'text-forge-secondary hover:text-forge-text'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Task List */}
      {filteredTodos.length === 0 ? (
        <div className="rounded-2xl bg-forge-card border border-forge-border p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forge-surface flex items-center justify-center text-forge-secondary mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-forge-text">No tasks in this view</h3>
          <p className="text-xs text-forge-secondary max-w-sm mx-auto">
            All caught up! Click "Add Task" to plan your upcoming data engineering study goals.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTodos.map((todo) => {
            const isOverdue = !todo.done && todo.dueDate && todo.dueDate < todayStr;
            const isDueToday = !todo.done && todo.dueDate === todayStr;
            const TargetIcon = getTargetIcon(todo.linkedRef?.type);

            return (
              <div
                key={todo.id}
                className={`rounded-xl bg-forge-card border p-4 flex items-center justify-between gap-3 transition-all ${
                  todo.done 
                    ? 'border-forge-border/40 opacity-60 bg-forge-card/40' 
                    : isOverdue 
                      ? 'border-red-500/40 hover:border-red-500/60' 
                      : isDueToday 
                        ? 'border-amber-500/40 hover:border-amber-500/60' 
                        : 'border-forge-border hover:border-track-python/30'
                }`}
              >
                {/* Left: Checkbox + Text */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-0.5 text-forge-secondary hover:text-track-python transition-colors shrink-0"
                    title={todo.done ? 'Mark active' : 'Mark complete (+15 XP)'}
                  >
                    {todo.done ? (
                      <CheckSquare className="w-4 h-4 text-track-python" />
                    ) : (
                      <Square className="w-4 h-4 text-forge-secondary hover:text-track-python" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <p className={`text-xs font-medium leading-relaxed ${
                      todo.done ? 'line-through text-forge-secondary' : 'text-forge-text'
                    }`}>
                      {todo.text}
                    </p>

                    {/* Metadata & Linked Target Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      {/* Due Date Indicator */}
                      {todo.dueDate && (
                        <span className={`flex items-center gap-1 px-2 py-0.2 rounded ${
                          todo.done 
                            ? 'text-forge-secondary' 
                            : isOverdue 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold' 
                              : isDueToday 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold' 
                                : 'text-forge-secondary'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {isDueToday ? 'Due Today' : isOverdue ? `Overdue (${todo.dueDate})` : `Due ${todo.dueDate}`}
                        </span>
                      )}

                      {/* Polymorphic Linked Content */}
                      {todo.linkedRef && (
                        <button
                          onClick={() => onNavigateToTarget && onNavigateToTarget(todo.linkedRef!)}
                          className="flex items-center gap-1 px-2 py-0.2 rounded bg-forge-surface border border-forge-border hover:border-track-python/40 text-track-python hover:text-white transition-colors"
                          title="Jump directly to linked target"
                        >
                          <TargetIcon className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{todo.linkedRef.title}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Delete Action */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 rounded-md text-forge-secondary hover:text-red-400 hover:bg-forge-surface transition-colors shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
