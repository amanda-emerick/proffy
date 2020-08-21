const Database = require('./database/db')

const { subjects, weekdays, getSubjects, convertHoursToMinutes, getweekdays } = require('./utils/format')//coloco entre as {} porque eu quero que ele me retorne os dados tais como eles estavam inseridos lá

function pageLanding(req, res) {
    return res.render("index.html")
}
  
async function pageStudy(req, res) {
  const filters = req.query //req.query contém as informações que vem após o ? do endereço url, ou seja, as informações dos profes
  
  const db = await Database
  const lastId = `
  SELECT * FROM proffys
  WHERE id = (SELECT MAX(id)  FROM proffys);
  `
  const numeroProffys = await db.all(lastId)

  if (!filters.subject || !filters.weekday || !filters.time) {
    const queryall = `
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
      SELECT class_schedule.*
      FROM class_schedule
      WHERE class_schedule.class_id = classes.id
    )
    `
    const proffys = await db.all(queryall)
    
    proffys.map((proffy) => {
      proffy.subject = getSubjects(proffy.subject)
    })    
      
      return res.render("study.html", { proffys, numeroProffys, filters, subjects, weekdays })
  }

  // converter horas em minutos
  const timeToMinutes = convertHoursToMinutes(filters.time)

  const query = `
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
      SELECT class_schedule.*
      FROM class_schedule
      WHERE class_schedule.class_id = classes.id
      AND class_schedule.weekday = ${filters.weekday}
      AND class_schedule.time_from <= ${timeToMinutes}
      AND class_schedule.time_to > ${timeToMinutes}
    )
    AND classes.subject = "${filters.subject}"
  `
    
  // caso haja erro na hora da consulta do banco de dados.
  try {
    const db = await Database
    const proffys = await db.all(query)

    proffys.map((proffy) => {
      proffy.subject = getSubjects(proffy.subject)
    })
    
    return res.render("study.html", { proffys, numeroProffys, subjects, filters, weekdays })
    
  } catch (error) {
    console.log(error)
  }
}

function pageGiveClasses(req, res) {
  return res.render("give-classes.html", { subjects, weekdays })
}
      
async function saveClasses(req, res) {
  const createProffy = require('./database/createProffy')
    
  //pegar os dados informados pelo usuário no formulário de cadastro
  const proffyValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio
  }
    
  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost
  }
    
  const classScheduleValues = req.body.weekday.map((weekday, index) => {
    return {
      weekday,
      time_from: convertHoursToMinutes(req.body.time_from[index]),
      time_to: convertHoursToMinutes(req.body.time_to[index])
    }
  })

  try {
    const db = await Database
    await createProffy(db, { proffyValue, classValue, classScheduleValues })

    let queryString = "?subject=" + req.body.subject
    queryString += "&weekday=" + req.body.weekday[0]
    queryString += "&time=" + req.body.time_from[0]
    
    return res.redirect("/success" + queryString)

  } catch (error) {
      console.log(error)
  }
      
} 

function pageSuccess(req, res) {
  return res.render("success.html")
}

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
  pageSuccess
}