import mongoose from "mongoose";
import Job from "../model/Jobs.js";
// crate jobs
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company) {
      res.status(400).send("plese provide required field");
    }
    req.body.created_by = req.user.userId;
    const job = await Job.create(req.body);
    res.send({ job });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
      errors: err,
    });
  }
};

// get jobs
export const getJobController = async (req, res, next) => {
  try {
    const { status, workType, search, sort } = req.query;
    const queryObject = {
      created_by: req.user.userId,
    };
    if (status && status !== "all") {
      queryObject.status = status;
    }
    if (workType && workType != "all") {
      queryObject.workType = workType;
    }
    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }
    let queryResult = Job.find(queryObject);

    //sorting
    if (sort === "latest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    }
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await Job.countDocuments(queryResult);
    const numberOfPage = Math.ceil(totalJobs / limit);
    const jobs = await queryResult;

    // const jobs = await Job.find();
    res.send({
      totalJobs,
      jobs,
      numberOfPage,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
};

// update job
export const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const updateData = req.body;
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) {
      return res.stauts(404).send({ msg: "job not found" });
    }
    res.send(job);
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
};

// delete job
export const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    //find job on the basis of id
    const job = await Job.findByIdAndRemove({ _id: id });
    //validation
    if (!job) {
      res.status(400).send("no job found whit this id");
    }
    res.send({
      message: "Job is deleted successfully",
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

//job stats and filter
export const jobStatsController = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: {
          created_by: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: `$company`,
          count: { $sum: 1 },
        },
      },
    ]);
    // default stats
    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0,
    };
    // monthly yearly state
    let monthlyAppliction = await Job.aggregate([
      {
        $match: {
          created_by: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: `$createdAt` },
            month: { $month: `$createdAt` },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({
      totalJobs: stats.length,
      stats,
      defaultStats,
      monthlyAppliction,
    });
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};

//UPDATE JOB
//export const updateJobController = async (err, req, res, next) => {
// try {
//   res.send("this is update");
// const { id } = req.params;
// const { company, position } = req.body;
// //validation
// if (!company || !position) {
//   res.status(400).send("Please provide all fields");
// }
// const job = await Job.findOne({ _id: id });
// if (!job) {
//   res.status(400).send(`no jobs found with this id${id}`);
// }
// if (req.user.userId == job.created_by.toString()) {
//   return;
// } else {
//   res.status(401).send("you are not authorized to update this job");
// }
// const updateJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
//   new: true,
// });
// res.send({ updateJob });
// } catch (err) {
//   res.status(400).send({
//    err,
//  });
// console.log(err);
// }
//};
