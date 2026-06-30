import ChecklistTopic from '../models/ChecklistTopic.js';

const defaultChecklist = [
  { subject: 'Quantitative Aptitude', name: 'Number System' },
  { subject: 'Quantitative Aptitude', name: 'Simplification' },
  { subject: 'Quantitative Aptitude', name: 'Percentage' },
  { subject: 'Quantitative Aptitude', name: 'Profit & Loss' },
  { subject: 'Quantitative Aptitude', name: 'Time & Work' },
  
  { subject: 'Reasoning', name: 'Blood Relations' },
  { subject: 'Reasoning', name: 'Coding-Decoding' },
  { subject: 'Reasoning', name: 'Seating Arrangement' },
  
  { subject: 'English', name: 'Vocabulary' },
  { subject: 'English', name: 'Grammar' },
  { subject: 'English', name: 'Reading Comprehension' },
  
  { subject: 'General Awareness', name: 'Banking Awareness' },
  { subject: 'General Awareness', name: 'Current Affairs' },
  { subject: 'General Awareness', name: 'Static GK' }
];

export async function getChecklist(req, res, next) {
  try {
    let topics = await ChecklistTopic.find({ user: req.user._id }).lean();
    
    // Seed default list if user has no topics
    if (topics.length === 0) {
      const seedData = defaultChecklist.map(item => ({
        user: req.user._id,
        subject: item.subject,
        name: item.name,
        completed: false,
        custom: false
      }));
      await ChecklistTopic.insertMany(seedData);
      topics = await ChecklistTopic.find({ user: req.user._id }).lean();
    }

    // Calculate overall stats and subject progress
    const total = topics.length;
    const completedCount = topics.filter(t => t.completed).length;
    const overallProgress = total ? Math.round((completedCount / total) * 100) : 0;

    // Group by subject and calculate subject progress
    const subjectsMap = {};
    topics.forEach(t => {
      if (!subjectsMap[t.subject]) {
        subjectsMap[t.subject] = {
          subject: t.subject,
          topics: [],
          total: 0,
          completed: 0
        };
      }
      subjectsMap[t.subject].topics.push({
        id: t._id,
        name: t.name,
        completed: t.completed,
        custom: t.custom,
        completedAt: t.completedAt
      });
      subjectsMap[t.subject].total += 1;
      if (t.completed) {
        subjectsMap[t.subject].completed += 1;
      }
    });

    const subjects = Object.values(subjectsMap).map(s => ({
      ...s,
      percentage: s.total ? Math.round((s.completed / s.total) * 100) : 0
    }));

    // Last 5 recently completed topics
    const recentlyCompleted = await ChecklistTopic.find({ user: req.user._id, completed: true })
      .sort({ completedAt: -1 })
      .limit(5)
      .lean();

    res.json({
      overallProgress,
      subjects,
      recentlyCompleted: recentlyCompleted.map(rc => ({
        id: rc._id,
        name: rc.name,
        subject: rc.subject,
        completedAt: rc.completedAt
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function addTopic(req, res, next) {
  try {
    const { name, subject } = req.body;
    if (!name?.trim() || !subject?.trim()) {
      return res.status(400).json({ message: 'Name and Subject are required' });
    }

    await ChecklistTopic.create({
      user: req.user._id,
      name: name.trim(),
      subject: subject.trim(),
      completed: false,
      custom: true
    });

    return getChecklist(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function updateTopic(req, res, next) {
  try {
    const { name, subject, completed } = req.body;
    const topic = await ChecklistTopic.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (name !== undefined) topic.name = name.trim();
    if (subject !== undefined) topic.subject = subject.trim();
    if (completed !== undefined) {
      topic.completed = completed;
      topic.completedAt = completed ? new Date() : null;
    }

    await topic.save();
    return getChecklist(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function deleteTopic(req, res, next) {
  try {
    const topic = await ChecklistTopic.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    return getChecklist(req, res, next);
  } catch (error) {
    next(error);
  }
}
