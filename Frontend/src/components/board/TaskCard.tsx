import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { type: 'Task', task },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                className={cn(
                    "p-3 cursor-grab active:cursor-grabbing border-0 shadow-sm hover:shadow-md transition-all bg-white group relative",
                    isDragging ? "opacity-30" : "",
                    isOverlay ? "rotate-2 scale-105 shadow-xl cursor-grabbing ring-2 ring-blue-500/20 z-50" : ""
                )}
            >
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-700 leading-snug">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {task.priority && (
                            <Badge variant="outline" className={cn(
                                "text-[10px] px-1.5 h-5 font-normal border-0",
                                task.priority === 'HIGH' ? "bg-red-50 text-red-600" :
                                    task.priority === 'MEDIUM' ? "bg-orange-50 text-orange-600" :
                                        "bg-blue-50 text-blue-600"
                            )}>
                                {task.priority}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}