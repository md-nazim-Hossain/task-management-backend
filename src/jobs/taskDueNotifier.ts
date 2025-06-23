import cron from 'node-cron';
import mongoose from 'mongoose';
import { Task } from '../app/modules/task/task.model';
import { Notification } from '../app/modules/notification/notification.model';
import { IGroup } from '../app/modules/group/group.interface';
import { ENUM_TASK_STATUS } from '../types/enum';

export const startDueDateNotifier = () => {
  // Runs every 5 minutes: '*/5 * * * *'
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    console.log('Running due date notifier');
    // await Notification.deleteMany();
    const dueTasks = await Task.find({
      status: ENUM_TASK_STATUS.COMPLETED,
      dueDate: { $gte: now, $lte: inOneHour },
      dueDateNotified: { $ne: true },
    });

    for (const task of dueTasks) {
      const recipients = new Set<string>();

      if (task.creator) recipients.add(task.creator.toString());
      const assignedTo = task.assignedTo as IGroup;
      if (assignedTo && 'members' in assignedTo) {
        assignedTo?.members?.forEach((m: any) =>
          recipients.add(m._id.toString())
        );
      }

      const message = `Task "${
        task.title
      }" is due at ${task.dueDate.toLocaleString()}`;

      for (const userId of recipients) {
        const notification = await Notification.create({
          receiver: userId,
          message,
          notificationType: 'task_due_soon',
          task: new mongoose.Types.ObjectId(task._id),
          sender: new mongoose.Types.ObjectId(task.creator._id),
        });
        globalThis.io.to(userId).emit('task_updated', notification);
      }

      task.dueDateNotified = true;
      await task.save();
    }
  });
};
