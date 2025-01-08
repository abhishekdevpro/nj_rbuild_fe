// WorkExperienceSection.js
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DateRange from "../utility/DateRange"; 

const WorkExperience = ({ resumeData, headerColor,className = "",
  style = {},
  itemClassNames = {}, }) => {
  if (!resumeData?.workExperience || resumeData.workExperience.length === 0) {
    return null;
  }

  return (
    <Droppable droppableId="work-experience" type="WORK_EXPERIENCE">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}  style={style}>
          <h2
          
          className={`${itemClassNames.title || ""}`}
            contentEditable
            suppressContentEditableWarning
            style={{
              color: headerColor,
              borderBottom: `2px solid ${headerColor}`,
            }}
          >
            Work Experience
          </h2>
          {resumeData.workExperience.map((item, index) => (
            <Draggable
              key={`${item.company}-${index}`}
              draggableId={`WORK_EXPERIENCE-${index}`}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`hover:scale-105 transition-transform duration-300 mb-1 
                    ${itemClassNames.content || ""}
                    ${
                    snapshot.isDragging && "outline-dashed outline-2 outline-gray-400 bg-white"  
                  }`}
                >
                  <div className="flex flex-row justify-between space-y-1">
                    <p  className={`${itemClassNames.company || ""}`}>{item.company}</p>
                    <DateRange
                      startYear={item.startYear}
                      endYear={item.endYear}
                      id={`work-experience-start-end-date`}
                    />
                  </div>
                
                  <div className="flex flex-row justify-between space-y-1">
                                    <p  className={``}>{item.position}</p>
                                    <p className={``}>{item.location}</p>
                                  </div>
                  <p
                    className=" hover:outline-dashed hover:outline-2 hover:outline-gray-400"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                  >
                    {item.description}
                  </p>

                  <Droppable
                    droppableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}`}
                    type="WORK_EXPERIENCE_KEY_ACHIEVEMENT"
                  >
                    {(provided) => (
                      <ul
                        className="list-disc pl-6"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {typeof item.keyAchievements === "string" &&
                          item.keyAchievements
                            .split("\n")
                            .map((achievement, subIndex) => (
                              <Draggable
                                key={`${item.company}-${index}-${subIndex}`}
                                draggableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}-${subIndex}`}
                                index={subIndex}
                              >
                                {(provided, snapshot) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`hover:scale-105 transition-transform duration-300 hover:outline-dashed hover:outline-2 hover:outline-gray-400 ${
                                      snapshot.isDragging &&
                                      "outline-dashed outline-2 outline-gray-400 bg-white"
                                    }`}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: achievement,
                                      }}
                                      contentEditable
                                    />
                                  </li>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default WorkExperience;