import StaffCard from '@/components/Card/StaffCard';
import { Tree, TreeNode } from 'react-organizational-chart';
import { styled } from 'styled-components';

const StyledNode = styled.div`
    padding: 6px 12px;
    border-radius: 8px;
    display: inline-block;
    border: 0px solid #d1d5db;
    // background: #fff;
    font-size: 14px;
    min-width: 144px;
    text-align: center;
`;

const OurStaffsStructure = () => {
    return (
        <>
            <div className="">
                <header className="my-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">រចនាសម្ព័ន្ធបណ្ណាល័យ ស.ភ.ន.វ.ស.</h1>
                </header>
                <div className="max-w-full overflow-x-scroll pb-20 text-center">
                    <Tree
                        lineWidth="1px"
                        lineColor="#9ca3af"
                        lineBorderRadius="8px"
                        label={
                            <StyledNode>
                                <StaffCard
                                    name="Dr. Ngann Sundet"
                                    name_kh="បណ្ឌិត ង៉ាន់ ស៊ុនដេត"
                                    role="ប្រធានបណ្ណាល័យ"
                                    imageUrl="/assets/rule_library/profiles/sundet.jpeg"
                                />
                            </StyledNode>
                        }
                    >
                        {/* LEVEL 1 Positions */}

                        {/* LEVEL 2 — Libraries under Deputy Director */}
                        <TreeNode
                            label={
                                <TreeNode label>
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="អ៊ុង សុបញ្ញាម៉ូនិក"
                                                    role="បណ្ណារក្សផ្នែករដ្ឋបាល"
                                                    imageUrl="/assets/rule_library/profiles/ung_sopanha_monik.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="គឹម ច័ន្ទត្រាបុត្រ"
                                                    role="បណ្ណារក្សបច្ចេកទេស"
                                                    imageUrl="/assets/rule_library/profiles/kim_chantraboth.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard name="" name_kh="ជូង ច័ន្ទរិទ្ធីនាថ" role="បណ្ណារក្សផ្នែករដ្ឋបាល" imageUrl="" />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                            }
                        >
                            {/* Law Library */}
                            <TreeNode label={<StyledNode>Law Library</StyledNode>}>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard name="" name_kh="លី រ៉ានី" role="បណ្ណារក្ស" imageUrl="" />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="ជ្រា មុនីនាថ"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/chrea_monineath.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard
                                                name=""
                                                name_kh="សេង វណ្ណា"
                                                role="បណ្ណារក្ស"
                                                imageUrl="/assets/rule_library/profiles/seng_vanna.jpg"
                                            />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="រិន សុទ្ធាលីនណា"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/rin_sothealinna.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                            </TreeNode>

                            {/* Economics Library */}
                            <TreeNode label={<StyledNode>Economics Library</StyledNode>}>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard
                                                name=""
                                                name_kh="ហ៊ាង ចាន់តាលីឡា"
                                                role="បណ្ណារក្ស"
                                                imageUrl="/assets/rule_library/profiles/heang_chantalila.png"
                                            />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="និត ស្រីណុច"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/nith_sreynoch.png"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard name="" name_kh="ឈិន ដារិត" role="បណ្ណារក្ស" imageUrl="" />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name=""
                                                    name_kh="វ៉ាង រ៉ាវុធ"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/vang_ravuth.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                            </TreeNode>

                            {/* Electronic Library */}
                            <TreeNode label={<StyledNode>Electronic Library</StyledNode>}>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard name="" name_kh="ម៉ៅ បូរ៉ា" role="បណ្ណារក្ស" imageUrl="" />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name="Kim Soreya"
                                                    name_kh="គឹម សូរិយា"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/kim_soreya.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                                <TreeNode
                                    label={
                                        <StyledNode>
                                            <StaffCard
                                                name=""
                                                name_kh="ហេង ណារ័ត្ន"
                                                role="បណ្ណារក្ស"
                                                imageUrl="/assets/rule_library/profiles/heng_narath.jpg"
                                            />
                                        </StyledNode>
                                    }
                                >
                                    <TreeNode
                                        label={
                                            <StyledNode>
                                                <StaffCard
                                                    name="Long Soeng"
                                                    name_kh="ឡុង សឹង"
                                                    role="បណ្ណារក្ស"
                                                    imageUrl="/assets/rule_library/profiles/long_soeng.jpg"
                                                />
                                            </StyledNode>
                                        }
                                    />
                                </TreeNode>
                            </TreeNode>
                        </TreeNode>
                    </Tree>
                </div>
            </div>
        </>
    );
};

export default OurStaffsStructure;
