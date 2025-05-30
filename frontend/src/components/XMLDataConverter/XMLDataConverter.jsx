import React, { useState } from 'react';
import "./XMLDataConverter.css"

const XMLDataConverter = () => {
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const BATCH_SIZE = 500;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('File selected. Ready to process.');
    };

    const parseBool = (val) => val === '1';

    const parseFloatOrNull = (val) => val ? parseFloat(val) : null;

    const parseIntOrNull = (val) => val ? parseInt(val) : null;

    const parseDateOrDefault = (val) =>
        val ? new Date(val).toISOString() : '2025-01-01T00:00:00Z';

    const formatDate = (val) => {
        if (!val) return null;
        const date = new Date(val);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const handleProcessFile = async () => {
        if (!file) {
            setStatus('Please select a file first.');
            return;
        }

        setStatus('Reading file...');
        const text = await file.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');

        // ========== 1. Parse Resource Nodes ==========
        // const resourceNodes = xmlDoc.getElementsByTagName('Resource');
        // const resources = Array.from(resourceNodes).map((node) => ({
        //     objectId: parseIntOrNull(node.getElementsByTagName('ObjectId')[0]?.textContent),
        //     autoComputeActuals: parseBool(node.getElementsByTagName('AutoComputeActuals')[0]?.textContent),
        //     calculateCostFromUnits: parseBool(node.getElementsByTagName('CalculateCostFromUnits')[0]?.textContent),
        //     calendarObjectId: parseIntOrNull(node.getElementsByTagName('CalendarObjectId')[0]?.textContent),
        //     currencyObjectId: parseIntOrNull(node.getElementsByTagName('CurrencyObjectId')[0]?.textContent),
        //     defaultUnitsPerTime: parseFloatOrNull(node.getElementsByTagName('DefaultUnitsPerTime')[0]?.textContent),
        //     emailAddress: node.getElementsByTagName('EmailAddress')[0]?.textContent || null,
        //     employeeId: node.getElementsByTagName('EmployeeId')[0]?.textContent || null,
        //     guid: node.getElementsByTagName('GUID')[0]?.textContent || null,
        //     id: node.getElementsByTagName('Id')[0]?.textContent || null,
        //     isActive: parseBool(node.getElementsByTagName('IsActive')[0]?.textContent),
        //     isOverTimeAllowed: parseBool(node.getElementsByTagName('IsOverTimeAllowed')[0]?.textContent),
        //     name: node.getElementsByTagName('Name')[0]?.textContent || null,
        //     officePhone: node.getElementsByTagName('OfficePhone')[0]?.textContent || null,
        //     otherPhone: node.getElementsByTagName('OtherPhone')[0]?.textContent || null,
        //     overtimeFactor: parseFloatOrNull(node.getElementsByTagName('OvertimeFactor')[0]?.textContent),
        //     parentObjectId: parseIntOrNull(node.getElementsByTagName('ParentObjectId')[0]?.textContent),
        //     primaryRoleObjectId: parseIntOrNull(node.getElementsByTagName('PrimaryRoleObjectId')[0]?.textContent),
        //     resourceNotes: node.getElementsByTagName('ResourceNotes')[0]?.textContent || null,
        //     resourceType: node.getElementsByTagName('ResourceType')[0]?.textContent || null,
        //     sequenceNumber: parseIntOrNull(node.getElementsByTagName('SequenceNumber')[0]?.textContent),
        //     shiftObjectId: parseIntOrNull(node.getElementsByTagName('ShiftObjectId')[0]?.textContent),
        //     timesheetApprMngrObjectId: parseIntOrNull(node.getElementsByTagName('TimesheetApprovalManagerObjectId')[0]?.textContent),
        //     title: node.getElementsByTagName('Title')[0]?.textContent || null,
        //     unitOfMeasureObjectId: parseIntOrNull(node.getElementsByTagName('UnitOfMeasureObjectId')[0]?.textContent),
        //     uploadDate: new Date().toISOString().split('T')[0],
        //     useTimesheets: parseBool(node.getElementsByTagName('UseTimesheets')[0]?.textContent),
        //     userObjectId: parseIntOrNull(node.getElementsByTagName('UserObjectId')[0]?.textContent),
        // }));

        // ========== 2. Parse Project Nodes ==========
        // const projectNodes = xmlDoc.getElementsByTagName('Project');
        // const projects = Array.from(projectNodes).map((node) => ({
        //     objectId: parseIntOrNull(node.getElementsByTagName('ObjectId')[0]?.textContent),
        //     wbsObjectId: parseIntOrNull(node.getElementsByTagName('WBSObjectId')[0]?.textContent),
        //     actDefCalendarObjectId: parseIntOrNull(node.getElementsByTagName('ActivityDefaultCalendarObjectId')[0]?.textContent),
        //     actDefCostAccountObjectId: parseIntOrNull(node.getElementsByTagName('ActivityDefaultCostAccountObjectId')[0]?.textContent),
        //     actDefPercentCompleteType: node.getElementsByTagName('ActivityDefaultPercentCompleteType')[0]?.textContent || "",
        //     actDefaultPricePerUnit: parseFloatOrNull(node.getElementsByTagName('ActivityDefaultPricePerUnit')[0]?.textContent),
        //     actIdBasedOnSelectedAct: parseBool(node.getElementsByTagName('ActivityIdBasedOnSelectedActivity')[0]?.textContent),
        //     actPerComplBaseOnActStep: parseBool(node.getElementsByTagName('ActivityPercentCompleteBasedOnActivitySteps')[0]?.textContent),
        //     activityDefaultActivityType: node.getElementsByTagName('ActivityDefaultActivityType')[0]?.textContent || "",
        //     activityDefaultDurationType: node.getElementsByTagName('ActivityDefaultDurationType')[0]?.textContent || "",
        //     activityIdIncrement: parseIntOrNull(node.getElementsByTagName('ActivityIdIncrement')[0]?.textContent),
        //     activityIdPrefix: node.getElementsByTagName('ActivityIdPrefix')[0]?.textContent || "",
        //     activityIdSuffix: node.getElementsByTagName('ActivityIdSuffix')[0]?.textContent || "",
        //     addActualToRemaining: parseBool(node.getElementsByTagName('AddActualToRemaining')[0]?.textContent),
        //     addedBy: node.getElementsByTagName('AddedBy')[0]?.textContent || "",
        //     allowNegActualUnitsFlag: parseBool(node.getElementsByTagName('AllowNegativeActualUnitsFlag')[0]?.textContent),
        //     allowStatusReview: parseBool(node.getElementsByTagName('AllowStatusReview')[0]?.textContent),
        //     annualDiscountRate: parseFloatOrNull(node.getElementsByTagName('AnnualDiscountRate')[0]?.textContent),
        //     anticipatedFinishDate: formatDate(node.getElementsByTagName('AnticipatedFinishDate')[0]?.textContent),
        //     anticipatedStartDate: formatDate(node.getElementsByTagName('AnticipatedStartDate')[0]?.textContent),
        //     assigDefaultDrivingFlag: parseBool(node.getElementsByTagName('AssignmentDefaultDrivingFlag')[0]?.textContent),
        //     assignmentDefaultRateType: node.getElementsByTagName('AssignmentDefaultRateType')[0]?.textContent || "",
        //     checkOutStatus: parseBool(node.getElementsByTagName('CheckOutStatus')[0]?.textContent),
        //     costQuantityRecalculateFlag: parseBool(node.getElementsByTagName('CostQuantityRecalculateFlag')[0]?.textContent),
        //     criticalActivityFloatLimit: parseIntOrNull(node.getElementsByTagName('CriticalActivityFloatLimit')[0]?.textContent),
        //     criticalActivityPathType: node.getElementsByTagName('CriticalActivityPathType')[0]?.textContent || "",
        //     currBLProjectObjectId: parseIntOrNull(node.getElementsByTagName('CurrentBaselineProjectObjectId')[0]?.textContent),
        //     dataDate: formatDate(node.getElementsByTagName('DataDate')[0]?.textContent),
        //     dateAdded: formatDate(node.getElementsByTagName('DateAdded')[0]?.textContent),
        //     defaultPriceTimeUnits: node.getElementsByTagName('DefaultPriceTimeUnits')[0]?.textContent || "",
        //     discountApplicationPeriod: node.getElementsByTagName('DiscountApplicationPeriod')[0]?.textContent || "",
        //     earnedValueComputeType: node.getElementsByTagName('EarnedValueComputeType')[0]?.textContent || "",
        //     earnedValueETCComputeType: node.getElementsByTagName('EarnedValueETCComputeType')[0]?.textContent || "",
        //     earnedValueETCUserValue: parseFloatOrNull(node.getElementsByTagName('EarnedValueETCUserValue')[0]?.textContent),
        //     earnedValueUserPercent: parseFloatOrNull(node.getElementsByTagName('EarnedValueUserPercent')[0]?.textContent),
        //     enableSummarization: parseBool(node.getElementsByTagName('EnableSummarization')[0]?.textContent),
        //     financialPeriodTemplateId: parseIntOrNull(node.getElementsByTagName('FinancialPeriodTemplateId')[0]?.textContent),
        //     fiscalYearStartMonth: parseIntOrNull(node.getElementsByTagName('FiscalYearStartMonth')[0]?.textContent),
        //     guid: node.getElementsByTagName('GUID')[0]?.textContent || "00000000-0000-0000-0000-000000000000",
        //     id: node.getElementsByTagName('Id')[0]?.textContent || "",
        //     independentETCLaborUnits: parseFloatOrNull(node.getElementsByTagName('IndependentETCLaborUnits')[0]?.textContent),
        //     independentETCTotalCost: parseFloatOrNull(node.getElementsByTagName('IndependentETCTotalCost')[0]?.textContent),
        //     lastFinPeriodObjectId: parseIntOrNull(node.getElementsByTagName('LastFinancialPeriodObjectId')[0]?.textContent),
        //     levelingPriority: parseIntOrNull(node.getElementsByTagName('LevelingPriority')[0]?.textContent),
        //     linkActualToActThisPeriod: parseBool(node.getElementsByTagName('LinkActualToActualThisPeriod')[0]?.textContent),
        //     linkPerCompleteWithActual: parseBool(node.getElementsByTagName('LinkPercentCompleteWithActual')[0]?.textContent),
        //     linkPlannedAndAtComplFlag: parseBool(node.getElementsByTagName('LinkPlannedAndAtCompletionFlag')[0]?.textContent),
        //     mustFinishByDate: formatDate(node.getElementsByTagName('MustFinishByDate')[0]?.textContent),
        //     name: node.getElementsByTagName('Name')[0]?.textContent || "",
        //     obsObjectId: parseIntOrNull(node.getElementsByTagName('OBSObjectId')[0]?.textContent),
        //     originalBudget: parseFloatOrNull(node.getElementsByTagName('OriginalBudget')[0]?.textContent),
        //     parentEPSObjectId: parseIntOrNull(node.getElementsByTagName('ParentEPSObjectId')[0]?.textContent),
        //     plannedStartDate: formatDate(node.getElementsByTagName('PlannedStartDate')[0]?.textContent),
        //     primResCanMarkActAsCompl: parseBool(node.getElementsByTagName('PrimaryResourcesCanMarkActivitiesAsCompleted')[0]?.textContent),
        //     projectForecastStartDate: formatDate(node.getElementsByTagName('ProjectForecastStartDate')[0]?.textContent),
        //     resCanAssignThemselToAct: parseBool(node.getElementsByTagName('ResourcesCanAssignThemselvesToActivities')[0]?.textContent),
        //     resCanBeAssToSameActMoreOnce: parseBool(node.getElementsByTagName('ResourceCanBeAssignedToSameActivityMoreThanOnce')[0]?.textContent),
        //     resetPlannToRemainingFlag: parseBool(node.getElementsByTagName('ResetPlannedToRemainingFlag')[0]?.textContent),
        //     scheduledFinishDate: formatDate(node.getElementsByTagName('ScheduledFinishDate')[0]?.textContent),
        //     status: node.getElementsByTagName('Status')[0]?.textContent || "",
        //     strategicPriority: parseIntOrNull(node.getElementsByTagName('StrategicPriority')[0]?.textContent),
        //     summarizeToWBSLevel: parseIntOrNull(node.getElementsByTagName('SummarizeToWBSLevel')[0]?.textContent),
        //     summaryLevel: parseIntOrNull(node.getElementsByTagName('SummaryLevel')[0]?.textContent),
        //     uploadDate: new Date().toISOString().split('T')[0], // today's date as YYYY-MM-DD
        //     useProjBLForEarnedValue: parseBool(node.getElementsByTagName('UseProjectBaselineForEarnedValue')[0]?.textContent),
        //     wbsCodeSeparator: node.getElementsByTagName('WBSCodeSeparator')[0]?.textContent || "",
        //     webSiteRootDirectory: node.getElementsByTagName('WebSiteRootDirectory')[0]?.textContent || "",
        //     webSiteURL: node.getElementsByTagName('WebSiteURL')[0]?.textContent || ""
        // }));

        // ========== 3. Parse WBS Nodes ==========
        // const wbsNodes = xmlDoc.getElementsByTagName('WBS');

        // const wbs = Array.from(wbsNodes).map((node) => ({
        //     projectObjectId: parseIntOrNull(node.getElementsByTagName('ProjectObjectId')[0]?.textContent),
        //     objectId: parseIntOrNull(node.getElementsByTagName('ObjectId')[0]?.textContent),
        //     parentObjectId: parseIntOrNull(node.getElementsByTagName('ParentObjectId')[0]?.textContent),
        //     anticipatedFinishDate: formatDate(node.getElementsByTagName('AnticipatedFinishDate')[0]?.textContent),
        //     anticipatedStartDate: formatDate(node.getElementsByTagName('AnticipatedStartDate')[0]?.textContent),
        //     code: node.getElementsByTagName('Code')[0]?.textContent || "",
        //     earnedValueComputeType: node.getElementsByTagName('EarnedValueComputeType')[0]?.textContent || "",
        //     earnedValueETCComputeType: node.getElementsByTagName('EarnedValueETCComputeType')[0]?.textContent || "",
        //     earnedValueETCUserValue: parseFloatOrNull(node.getElementsByTagName('EarnedValueETCUserValue')[0]?.textContent),
        //     earnedValueUserPercent: parseFloatOrNull(node.getElementsByTagName('EarnedValueUserPercent')[0]?.textContent),
        //     independentETCLaborUnits: parseFloatOrNull(node.getElementsByTagName('IndependentETCLaborUnits')[0]?.textContent),
        //     independentETCTotalCost: parseFloatOrNull(node.getElementsByTagName('IndependentETCTotalCost')[0]?.textContent),
        //     name: node.getElementsByTagName('Name')[0]?.textContent || "",
        //     obsObjectId: parseIntOrNull(node.getElementsByTagName('OBSObjectId')[0]?.textContent),
        //     originalBudget: parseFloatOrNull(node.getElementsByTagName('OriginalBudget')[0]?.textContent),
        //     sequenceNumber: parseIntOrNull(node.getElementsByTagName('SequenceNumber')[0]?.textContent),
        //     status: node.getElementsByTagName('Status')[0]?.textContent || "",
        //     uploadDate: new Date().toISOString().split('T')[0],
        //     wbsCategoryObjectId: parseIntOrNull(node.getElementsByTagName('WBSCategoryObjectId')[0]?.textContent),
        // }))

        // ========== 4. Parse Activity Nodes ==========
        // const activityNodes = xmlDoc.getElementsByTagName('Activity');
        // const activityItems = Array.from(activityNodes).map((node) => {
        //     const codeNodes = node.getElementsByTagName('Code');
        //     const udfNode = node.getElementsByTagName('UDF')[0];

        //     return {
        //         objectId: parseIntOrNull(node.getElementsByTagName('ObjectId')[0]?.textContent),
        //         guid: node.getElementsByTagName('GUID')[0]?.textContent?.replace(/[{}]/g, '') || "",
        //         id: node.getElementsByTagName('Id')[0]?.textContent || "",
        //         name: node.getElementsByTagName('Name')[0]?.textContent || "",
        //         status: node.getElementsByTagName('Status')[0]?.textContent || "",
        //         type: node.getElementsByTagName('Type')[0]?.textContent || "",
        //         calendarObjectId: parseIntOrNull(node.getElementsByTagName('CalendarObjectId')[0]?.textContent),
        //         projectObjectId: parseIntOrNull(node.getElementsByTagName('ProjectObjectId')[0]?.textContent),
        //         wbsObjectId: parseIntOrNull(node.getElementsByTagName('WBSObjectId')[0]?.textContent),
        //         startDate: parseDateOrDefault(node.getElementsByTagName('StartDate')[0]?.textContent),
        //         finishDate: parseDateOrDefault(node.getElementsByTagName('FinishDate')[0]?.textContent),
        //         plannedStartDate: parseDateOrDefault(node.getElementsByTagName('PlannedStartDate')[0]?.textContent),
        //         plannedFinishDate: parseDateOrDefault(node.getElementsByTagName('PlannedFinishDate')[0]?.textContent),
        //         remainingEarlyStartDate: parseDateOrDefault(node.getElementsByTagName('RemainingEarlyStartDate')[0]?.textContent),
        //         remainingEarlyFinishDate: parseDateOrDefault(node.getElementsByTagName('RemainingEarlyFinishDate')[0]?.textContent),
        //         remainingLateStartDate: parseDateOrDefault(node.getElementsByTagName('RemainingLateStartDate')[0]?.textContent),
        //         remainingLateFinishDate: parseDateOrDefault(node.getElementsByTagName('RemainingLateFinishDate')[0]?.textContent),
        //         actualStartDate: parseDateOrDefault(node.getElementsByTagName('ActualStartDate')[0]?.textContent),
        //         actualFinishDate: parseDateOrDefault(node.getElementsByTagName('ActualFinishDate')[0]?.textContent),
        //         expectedFinishDate: parseDateOrDefault(node.getElementsByTagName('ExpectedFinishDate')[0]?.textContent),
        //         primaryConstraintDate: parseDateOrDefault(node.getElementsByTagName('PrimaryConstraintDate')[0]?.textContent),
        //         secondaryConstraintDate: parseDateOrDefault(node.getElementsByTagName('SecondaryConstraintDate')[0]?.textContent),
        //         suspendDate: parseDateOrDefault(node.getElementsByTagName('SuspendDate')[0]?.textContent),
        //         resumeDate: parseDateOrDefault(node.getElementsByTagName('ResumeDate')[0]?.textContent),
        //         durationType: node.getElementsByTagName('DurationType')[0]?.textContent || "",
        //         primaryConstraintType: node.getElementsByTagName('PrimaryConstraintType')[0]?.textContent || "",
        //         secondaryConstraintType: node.getElementsByTagName('SecondaryConstraintType')[0]?.textContent || "",
        //         percentCompleteType: node.getElementsByTagName('PercentCompleteType')[0]?.textContent || "",
        //         levelingPriority: node.getElementsByTagName('LevelingPriority')[0]?.textContent || "",
        //         notesToResources: node.getElementsByTagName('NotesToResources')[0]?.textContent || "",
        //         feedback: node.getElementsByTagName('Feedback')[0]?.textContent || "",
        //         isNewFeedback: parseBool(node.getElementsByTagName('IsNewFeedback')[0]?.textContent),
        //         reviewRequired: parseBool(node.getElementsByTagName('ReviewRequired')[0]?.textContent),
        //         autoComputeActuals: parseBool(node.getElementsByTagName('AutoComputeActuals')[0]?.textContent),
        //         estimatedWeight: parseFloatOrNull(node.getElementsByTagName('EstimatedWeight')[0]?.textContent),
        //         durationPercentComplete: parseFloatOrNull(node.getElementsByTagName('DurationPercentComplete')[0]?.textContent),
        //         scopePercentComplete: parseFloatOrNull(node.getElementsByTagName('ScopePercentComplete')[0]?.textContent),
        //         unitsPercentComplete: parseFloatOrNull(node.getElementsByTagName('UnitsPercentComplete')[0]?.textContent),
        //         nonLaborUnitsPerComplete: parseFloatOrNull(node.getElementsByTagName('NonLaborUnitsPercentComplete')[0]?.textContent),
        //         percentComplete: parseFloatOrNull(node.getElementsByTagName('PercentComplete')[0]?.textContent),
        //         physicalPercentComplete: parseFloatOrNull(node.getElementsByTagName('PhysicalPercentComplete')[0]?.textContent),
        //         actualDuration: parseFloatOrNull(node.getElementsByTagName('ActualDuration')[0]?.textContent),
        //         plannedDuration: parseFloatOrNull(node.getElementsByTagName('PlannedDuration')[0]?.textContent),
        //         remainingDuration: parseFloatOrNull(node.getElementsByTagName('RemainingDuration')[0]?.textContent),
        //         atCompletionDuration: parseFloatOrNull(node.getElementsByTagName('AtCompletionDuration')[0]?.textContent),
        //         plannedLaborUnits: parseFloatOrNull(node.getElementsByTagName('PlannedLaborUnits')[0]?.textContent),
        //         remainingLaborUnits: parseFloatOrNull(node.getElementsByTagName('RemainingLaborUnits')[0]?.textContent),
        //         atCompletionLaborUnits: parseFloatOrNull(node.getElementsByTagName('AtCompletionLaborUnits')[0]?.textContent),
        //         actualLaborUnits: parseFloatOrNull(node.getElementsByTagName('ActualLaborUnits')[0]?.textContent),
        //         actualThisPeriodLaborUnits: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodLaborUnits')[0]?.textContent),
        //         plannedNonLaborUnits: parseFloatOrNull(node.getElementsByTagName('PlannedNonLaborUnits')[0]?.textContent),
        //         remainingNonLaborUnits: parseFloatOrNull(node.getElementsByTagName('RemainingNonLaborUnits')[0]?.textContent),
        //         atCompletionNonLaborUnits: parseFloatOrNull(node.getElementsByTagName('AtCompletionNonLaborUnits')[0]?.textContent),
        //         actualNonLaborUnits: parseFloatOrNull(node.getElementsByTagName('ActualNonLaborUnits')[0]?.textContent),
        //         actThisPeriodNonLaborUnits: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodNonLaborUnits')[0]?.textContent),
        //         plannedLaborCost: parseFloatOrNull(node.getElementsByTagName('PlannedLaborCost')[0]?.textContent),
        //         remainingLaborCost: parseFloatOrNull(node.getElementsByTagName('RemainingLaborCost')[0]?.textContent),
        //         atCompletionLaborCost: parseFloatOrNull(node.getElementsByTagName('AtCompletionLaborCost')[0]?.textContent),
        //         actualLaborCost: parseFloatOrNull(node.getElementsByTagName('ActualLaborCost')[0]?.textContent),
        //         actualThisPeriodLaborCost: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodLaborCost')[0]?.textContent),
        //         plannedNonLaborCost: parseFloatOrNull(node.getElementsByTagName('PlannedNonLaborCost')[0]?.textContent),
        //         remainingNonLaborCost: parseFloatOrNull(node.getElementsByTagName('RemainingNonLaborCost')[0]?.textContent),
        //         atCompletionNonLaborCost: parseFloatOrNull(node.getElementsByTagName('AtCompletionNonLaborCost')[0]?.textContent),
        //         actualNonLaborCost: parseFloatOrNull(node.getElementsByTagName('ActualNonLaborCost')[0]?.textContent),
        //         actThisPeriodNonLaborCost: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodNonLaborCost')[0]?.textContent),
        //         atCompletionExpenseCost: parseFloatOrNull(node.getElementsByTagName('AtCompletionExpenseCost')[0]?.textContent),
        //         primaryResourceObjectId: parseIntOrNull(node.getElementsByTagName('PrimaryResourceObjectId')[0]?.textContent),
        //         udfTypeObjectId: parseIntOrNull(udfNode?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         udfTextValue: udfNode?.getElementsByTagName('TextValue')[0]?.textContent || "",
        //         codeTypeObjectId1: parseIntOrNull(codeNodes[0]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId1: parseIntOrNull(codeNodes[0]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId2: parseIntOrNull(codeNodes[1]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId2: parseIntOrNull(codeNodes[1]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId3: parseIntOrNull(codeNodes[2]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId3: parseIntOrNull(codeNodes[2]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId4: parseIntOrNull(codeNodes[3]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId4: parseIntOrNull(codeNodes[3]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId5: parseIntOrNull(codeNodes[4]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId5: parseIntOrNull(codeNodes[4]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId6: parseIntOrNull(codeNodes[5]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId6: parseIntOrNull(codeNodes[5]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId7: parseIntOrNull(codeNodes[6]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId7: parseIntOrNull(codeNodes[6]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId8: parseIntOrNull(codeNodes[7]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId8: parseIntOrNull(codeNodes[7]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         codeTypeObjectId9: parseIntOrNull(codeNodes[8]?.getElementsByTagName('TypeObjectId')[0]?.textContent),
        //         codeValueObjectId9: parseIntOrNull(codeNodes[8]?.getElementsByTagName('ValueObjectId')[0]?.textContent),
        //         uploadDate: new Date().toISOString().split('T')[0]
        //     };
        // });

        // ========== 5. Parse Resource Assignment Nodes ==========
        const resourceAssignmentNodes = xmlDoc.getElementsByTagName('ResourceAssignment');
        const resourceAssignmentItems = Array.from(resourceAssignmentNodes).map((node) => {
            return {
                objectId: parseIntOrNull(node.getElementsByTagName('ObjectId')[0]?.textContent),
                guid: node.getElementsByTagName('GUID')[0]?.textContent?.replace(/[{}]/g, '') || "",
                projectObjectId: parseIntOrNull(node.getElementsByTagName('ProjectObjectId')[0]?.textContent),
                wbsObjectId: parseIntOrNull(node.getElementsByTagName('WBSObjectId')[0]?.textContent),
                resourceObjectId: parseIntOrNull(node.getElementsByTagName('ResourceObjectId')[0]?.textContent),
                activityObjectId: parseIntOrNull(node.getElementsByTagName('ActivityObjectId')[0]?.textContent),
                costAccountObjectId: parseIntOrNull(node.getElementsByTagName('CostAccountObjectId')[0]?.textContent),
                resourceCurveObjectId: parseIntOrNull(node.getElementsByTagName('ResourceCurveObjectId')[0]?.textContent),
                roleObjectId: parseIntOrNull(node.getElementsByTagName('RoleObjectId')[0]?.textContent),

                actualCost: parseFloatOrNull(node.getElementsByTagName('ActualCost')[0]?.textContent),
                actualCurve: node.getElementsByTagName('ActualCurve')[0]?.textContent || "",
                actualFinishDate: parseDateOrDefault(node.getElementsByTagName('ActualFinishDate')[0]?.textContent),
                actualOvertimeCost: parseFloatOrNull(node.getElementsByTagName('ActualOvertimeCost')[0]?.textContent),
                actualOvertimeUnits: parseFloatOrNull(node.getElementsByTagName('ActualOvertimeUnits')[0]?.textContent),
                actualRegularCost: parseFloatOrNull(node.getElementsByTagName('ActualRegularCost')[0]?.textContent),
                actualRegularUnits: parseFloatOrNull(node.getElementsByTagName('ActualRegularUnits')[0]?.textContent),
                actualStartDate: parseDateOrDefault(node.getElementsByTagName('ActualStartDate')[0]?.textContent),
                actualThisPeriodCost: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodCost')[0]?.textContent),
                actualThisPeriodUnits: parseFloatOrNull(node.getElementsByTagName('ActualThisPeriodUnits')[0]?.textContent),
                actualUnits: parseFloatOrNull(node.getElementsByTagName('ActualUnits')[0]?.textContent),

                atCompletionCost: parseFloatOrNull(node.getElementsByTagName('AtCompletionCost')[0]?.textContent),
                atCompletionUnits: parseFloatOrNull(node.getElementsByTagName('AtCompletionUnits')[0]?.textContent),

                drivingActivityDatesFlag: parseBool(node.getElementsByTagName('DrivingActivityDatesFlag')[0]?.textContent),
                isCostUnitsLinked: parseBool(node.getElementsByTagName('IsCostUnitsLinked')[0]?.textContent),
                isPrimaryResource: parseBool(node.getElementsByTagName('IsPrimaryResource')[0]?.textContent),

                finishDate: parseDateOrDefault(node.getElementsByTagName('FinishDate')[0]?.textContent),
                startDate: parseDateOrDefault(node.getElementsByTagName('StartDate')[0]?.textContent),

                plannedCost: parseFloatOrNull(node.getElementsByTagName('PlannedCost')[0]?.textContent),
                plannedCurve: node.getElementsByTagName('PlannedCurve')[0]?.textContent || "",
                plannedFinishDate: parseDateOrDefault(node.getElementsByTagName('PlannedFinishDate')[0]?.textContent),
                plannedLag: parseIntOrNull(node.getElementsByTagName('PlannedLag')[0]?.textContent),
                plannedStartDate: parseDateOrDefault(node.getElementsByTagName('PlannedStartDate')[0]?.textContent),
                plannedUnits: parseFloatOrNull(node.getElementsByTagName('PlannedUnits')[0]?.textContent),
                plannedUnitsPerTime: parseFloatOrNull(node.getElementsByTagName('PlannedUnitsPerTime')[0]?.textContent),

                remainingCost: parseFloatOrNull(node.getElementsByTagName('RemainingCost')[0]?.textContent),
                remainingCurve: node.getElementsByTagName('RemainingCurve')[0]?.textContent || "",
                remainingDuration: parseFloatOrNull(node.getElementsByTagName('RemainingDuration')[0]?.textContent),
                remainingFinishDate: parseDateOrDefault(node.getElementsByTagName('RemainingFinishDate')[0]?.textContent),
                remainingLag: parseIntOrNull(node.getElementsByTagName('RemainingLag')[0]?.textContent),
                remainingStartDate: parseDateOrDefault(node.getElementsByTagName('RemainingStartDate')[0]?.textContent),
                remainingUnits: parseFloatOrNull(node.getElementsByTagName('RemainingUnits')[0]?.textContent),
                remainingUnitsPerTime: parseFloatOrNull(node.getElementsByTagName('RemainingUnitsPerTime')[0]?.textContent),

                overtimeFactor: parseFloatOrNull(node.getElementsByTagName('OvertimeFactor')[0]?.textContent),
                pricePerUnit: parseFloatOrNull(node.getElementsByTagName('PricePerUnit')[0]?.textContent),

                proficiency: node.getElementsByTagName('Proficiency')[0]?.textContent || "",
                rateSource: node.getElementsByTagName('RateSource')[0]?.textContent || "",
                rateType: node.getElementsByTagName('RateType')[0]?.textContent || "",

                unitsPercentComplete: parseFloatOrNull(node.getElementsByTagName('UnitsPercentComplete')[0]?.textContent),

                resourceType: node.getElementsByTagName('ResourceType')[0]?.textContent || "",
                uploadDate: new Date().toISOString().split("T")[0],
            };
        });



        // console.log("ResourceNode: ", resourceNodes);
        // console.log("ProjectNodes: ", projectNodes);
        // console.log("WBSNodes: ", wbsNodes);
        // console.log("ActivityItems: ", activityItems);
        // console.log("ResourceAssignment: ", resourceAssignmentItems);




        setStatus('Fetching access token...');
        let token;
        try {
            // const res = await fetch('https://xml-data-extraction-backend.onrender.com/getToken');
            const res = await fetch('https://xml2bc-dev-uat-backend.onrender.com/getToken');
            const data = await res.json();
            token = data.access_token;
            console.log("token: ", token)
        } catch (error) {
            setStatus('Failed to fetch access token.');
            return;
        }

        // ========== 1. Send Resource Data ==========
        setStatus('Sending resources to Business Central...');
        // const resourceEndpoint = 'https://api.businesscentral.dynamics.com/v2.0/50b7a7db-965b-4a2e-8f58-39e635bf39b5/DEVUAT/api/alletec/primavera/v2.0/companies(f08e82f1-72e8-ef11-9345-6045bd14c5d0)/p6resources';
        // try {
        //     for (let i = 0; i < resources.length; i += BATCH_SIZE) {
        //         const resourceArray = resources.slice(i, i + BATCH_SIZE);
        //         console.log(`resourceArray:  `, resourceArray)

        //         const resourceObject = {
        //             "primaryKey": "",
        //             "resources": resourceArray
        //         };

        //         const resourceResponse = await fetch(resourceEndpoint, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify(resourceObject)
        //         })
        //         if (!resourceResponse.ok) throw new Error(`Resource error: ${await resourceResponse.text()}`);
        //     }
        // } catch (err) {
        //     setStatus(`Error sending Resource data: ${err.message}`);
        //     return;
        // }


        // ========== 2. Send Project Data ==========


        setStatus('Sending projects to Business Central...');
        // const projectEndpoint = 'https://api.businesscentral.dynamics.com/v2.0/50b7a7db-965b-4a2e-8f58-39e635bf39b5/DEVUAT/api/alletec/primavera/v2.0/companies(f08e82f1-72e8-ef11-9345-6045bd14c5d0)/projects';


        // try {
        //     for (const project of projects) {
        //         console.log('Sending project to BC:', JSON.stringify(project, null, 2));

        //         const response = await fetch(projectEndpoint, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify(project),
        //         });
        //         if (!response.ok) throw new Error(`Project error: ${await response.text()}`);
        //     }
        // } catch (err) {
        //     setStatus(`Error sending project data: ${err.message}`);
        //     return;
        // }

        // ========== 3. Send WBS Data ==========
        setStatus('Sending WBS to Business Central...');
        // const wbsEndpoints = 'https://api.businesscentral.dynamics.com/v2.0/50b7a7db-965b-4a2e-8f58-39e635bf39b5/DEVUAT/api/alletec/primavera/v2.0/companies(f08e82f1-72e8-ef11-9345-6045bd14c5d0)/p6wbsstagingroots';

        // try {
        //     for (let i = 0; i < wbs.length; i += BATCH_SIZE) {
        //         const wbsArray = wbs.slice(i, i + BATCH_SIZE);
        //         console.log(`wbsArray:  `, wbsArray)

        //         const wbsObject = {
        //             "primaryKey": "",
        //             "wbss": wbsArray
        //         };

        //         const wbsResponse = await fetch(wbsEndpoints, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify(wbsObject)
        //         })
        //         if (!wbsResponse.ok) throw new Error(`WBS error: ${await wbsResponse.text()}`);
        //     }
        // } catch (err) {
        //     setStatus(`Error sending WBS data: ${err.message}`);
        //     return;
        // }




        // ========== 4. Send Activity Data ==========

        setStatus('Sending Activity to Business Central...');
        // const activityEndpoints = 'https://api.businesscentral.dynamics.com/v2.0/50b7a7db-965b-4a2e-8f58-39e635bf39b5/DEVUAT/api/alletec/primavera/v2.0/companies(f08e82f1-72e8-ef11-9345-6045bd14c5d0)/p6activityroots';


        // try {
        //     for (let i = 0; i < activityItems.length; i += BATCH_SIZE) {
        //         const activityArray = activityItems.slice(i, i + BATCH_SIZE);
        //         console.log(`activityArray:  `, activityArray)

        //         const activityObject = {
        //             "primaryKey": "",
        //             "activitys": activityArray
        //         };

        //         const activityResponse = await fetch(activityEndpoints, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify(activityObject)
        //         })
        //         if (!activityResponse.ok) throw new Error(`Activity error: ${await activityResponse.text()}`);
        //     }
        // } catch (err) {
        //     setStatus(`Error sending Activity data: ${err.message}`);
        //     return;
        // }






        // ========== 5. Send Resource Assignment Data ==========

        setStatus('Sending ResourceAssignment to Business Central...');

        const resourceAssignmentEndpoints = 'https://api.businesscentral.dynamics.com/v2.0/50b7a7db-965b-4a2e-8f58-39e635bf39b5/DEVUAT/api/alletec/primavera/v2.0/companies(f08e82f1-72e8-ef11-9345-6045bd14c5d0)/p6resourceassignmentroots';

        const resourceAssignmentBatch = Math.ceil(resourceAssignmentItems.length / BATCH_SIZE);

        try {
            for (let i = 0; i < resourceAssignmentItems.length; i += BATCH_SIZE) {
                const batchIdx = i / BATCH_SIZE;
                const resourceAssignmentArray = resourceAssignmentItems.slice(i, i + BATCH_SIZE);
                console.log(`resourceAssignmentArray:  `, resourceAssignmentArray)

                const resourceAssignmentObject = {
                    "primaryKey": "",
                    "resourceassignments": resourceAssignmentArray
                };

                const resourceAssignmentResponse = await fetch(resourceAssignmentEndpoints, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(resourceAssignmentObject)
                })

                if (!resourceAssignmentResponse.ok) {
                    throw new Error(`ResourceAssignment error: ${await resourceAssignmentResponse.text()}`);
                }
                const progressValue = Math.round(((batchIdx + 1) / resourceAssignmentBatch) * 100);
                setProgress(progressValue);
                
            }
        } catch (err) {
            setStatus(`Error sending ResourceAssignment data: ${err.message}`);
            return;
        }


        setStatus('All resource, project, WBS, Activity, ResourceAssignment data sent successfully!');
    };

    return (
        <div className="upload-container">
            <h2 className="upload-title">Upload Your File</h2>

            <label className="file-label">
                Select File
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </label>

            <button onClick={handleProcessFile} className="submit-button">
                Process PrimaVera Data
            </button>

            {status && <p className="status-message">{status}</p>}

            {progress > 0 && (
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default XMLDataConverter;
